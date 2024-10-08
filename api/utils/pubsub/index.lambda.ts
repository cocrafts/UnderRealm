/* eslint-disable @typescript-eslint/no-explicit-any */
import { postToConnection } from 'utils/aws/gateway';
import { globalContext } from 'utils/context/index.lambda';
import { logger } from 'utils/logger';
import { redis } from 'utils/redis';
import { v4 as uuidv4 } from 'uuid';

import { graphqlEventTypes } from './utils';

export * from './utils';

logger.info('Use Lambda Pubsub');

const DAY_IN_SECONDS = 60 * 60 * 24;

/**
 * A topic key stores list of subscription keys.
 * A subscription key stores a string value [connectionId, ...topicKeys].join(".").
 */
export const pubsub = {
	subscribe: async (topics: string | string[]) => {
		const connectionId = globalContext.connectionId;
		if (!connectionId) throw Error('require connection id to use this pubsub');
		/**
		 * Auto create subscription id to support general pubsub which does not follow graphql pubsub
		 */
		const subscriptionId = globalContext.subscriptionId || uuidv4();

		if (typeof topics === 'string') {
			const topic = topics;
			await Promise.all([
				registerTopic(topic, subscriptionId),
				storeSubscription(subscriptionId, connectionId, [topic]),
			]);
		} else {
			const registerPromises = topics.map(async (topic) => {
				await registerTopic(topic, subscriptionId);
			});

			await Promise.all([
				...registerPromises,
				storeSubscription(subscriptionId, connectionId, topics),
			]);
		}

		// mock AsyncIterator to be compliance with resolver (graphql engine)
		return (async function* () {})();
	},
	unsubscribe: async (subscriptionId: string) => {
		const subscriptionKey = constructSubscriptionKey(subscriptionId);
		const subscription = await redis.GET(subscriptionKey);
		if (!subscription || !subscription.includes('.'))
			throw Error('Subscription not found');

		const [connectionId, ...topicKeys] = subscription.split('.');

		const unregisterPromises = topicKeys.map(async (topicKey) => {
			return await unregisterTopic(topicKey, subscriptionId);
		});

		await Promise.all([
			...unregisterPromises,
			redis.DEL(subscriptionKey),
			postToConnection(connectionId, {
				id: subscriptionId,
				type: 'complete',
			}),
		]);
	},
	publish: async (topic: string, payload: any) => {
		const topicKey = constructTopicKey(topic);
		const subscriptionKeys = await redis.SMEMBERS(topicKey);

		const publishPromises = subscriptionKeys.map(async (subscriptionKey) => {
			const subscription = await redis.GET(subscriptionKey);
			if (!subscription || !subscription.includes('.'))
				throw Error('Subscription not found');

			const connectionId = subscription.split('.')[0];
			const subscriptionId = subscriptionKey.split('#')[1];

			const isNonGraphql =
				payload.type && !graphqlEventTypes.includes(payload.type);
			if (isNonGraphql) {
				return await postToConnection(connectionId, payload);
			} else {
				return await postToConnection(connectionId, {
					id: subscriptionId,
					type: 'next',
					payload: { data: payload },
				});
			}
		});

		await Promise.all(publishPromises);
	},
};

const registerTopic = async (topic: string, subscriptionId: string) => {
	const topicKey = constructTopicKey(topic);
	const subscriptionKey = constructSubscriptionKey(subscriptionId);

	await Promise.all([
		redis.SADD(topicKey, subscriptionKey),
		redis.EXPIRE(topicKey, DAY_IN_SECONDS),
	]);
};

const unregisterTopic = async (topicKey: string, subscriptionId: string) => {
	const subscriptionKey = constructSubscriptionKey(subscriptionId);

	await redis.SREM(topicKey, subscriptionKey);
};

const storeSubscription = async (
	subscriptionId: string,
	connectionId: string,
	topics: string[],
) => {
	const subscriptionKey = constructSubscriptionKey(subscriptionId);
	const topicKeys = topics.map(constructTopicKey);
	const subscriptionValue = [connectionId, ...topicKeys].join('.');

	await redis.SET(subscriptionKey, subscriptionValue, { EX: DAY_IN_SECONDS });
};

const constructTopicKey = (topic: string) => {
	return `pubsub:topic:${topic}`;
};

const constructSubscriptionKey = (subscriptionId: string) => {
	return `pubsub:subscription#${subscriptionId}`;
};
