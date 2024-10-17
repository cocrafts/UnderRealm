import { defaultSetting, ecsv1, initializeDuel } from '@underrealm/game';
import { makeDuel } from 'game/duel';
import { GameDuel } from 'models/game';
import { GameDuelV2 } from 'models/gameV2';
import { logger } from 'utils/logger';
import { pubsub } from 'utils/pubsub';
import { redis } from 'utils/redis';

/**
 * Game Matching with REDIS, only for reference
 *
 * important: need to make sure execution time of each job running is less than schedule interval.
 * The current implementation does not ensure atomicity of findMatch pubsub topic.
 *
 * This job will retrieve a bundle of findMatch subscriptions, after publish match found event with gameId,
 * It will invalidate the all findMatch topics to make sure there is no more `publish` for each findMatch
 */
export const handler = async () => {
	logger.info('start matching job');

	let pendingFindingKey: string;
	const matchPromises = [];

	for await (const key of redis.scanIterator({
		MATCH: `matchFinding:user#*`,
		COUNT: 100,
	})) {
		if (!pendingFindingKey) {
			pendingFindingKey = key;
			return;
		}

		matchPromises.push(initializeGameMatch(pendingFindingKey, key));
		matchPromises.push(initializeGameMatchV2(pendingFindingKey, key));

		pendingFindingKey = null;
	}

	await Promise.all(matchPromises);

	logger.info('end matching job');

	return { statusCode: 200 };
};

const initializeGameMatch = async (
	firstFindingKey: string,
	secondFindingKey: string,
) => {
	const [firstTopic, secondTopic] = await Promise.all([
		redis.GETDEL(firstFindingKey),
		redis.GETDEL(secondFindingKey),
	]);

	if (!firstTopic) {
		logger.warn(`Not found pubsub topic of: ${firstFindingKey}`);
		return;
	}
	if (!secondTopic) {
		logger.warn(`Not found pubsub topic of: ${secondFindingKey}`);
		return;
	}

	const firstPlayerId = firstFindingKey.split('#')[1];
	const secondPlayerId = secondFindingKey.split('#')[1];

	const { config, history } = makeDuel('00001', firstPlayerId, secondPlayerId);
	const duel = await GameDuel.create({ config, history });

	await Promise.all([
		pubsub.publish(firstTopic, { findMatch: { id: duel.id } }),
		pubsub.publish(secondTopic, { findMatch: { id: duel.id } }),
	]);
};

const initializeGameMatchV2 = async (
	firstFindingKey: string,
	secondFindingKey: string,
) => {
	const [firstTopic, secondTopic] = await Promise.all([
		redis.GETDEL(firstFindingKey),
		redis.GETDEL(secondFindingKey),
	]);

	if (!firstTopic) {
		logger.warn(`Not found pubsub topic of: ${firstFindingKey}`);
		return;
	}
	if (!secondTopic) {
		logger.warn(`Not found pubsub topic of: ${secondFindingKey}`);
		return;
	}

	const firstPlayerId = firstFindingKey.split('#')[1];
	const secondPlayerId = secondFindingKey.split('#')[1];

	const duelECS = initializeDuel(ecsv1, defaultSetting, [
		{ id: firstPlayerId },
		{ id: secondPlayerId },
	]);
	const duel = await GameDuelV2.create({ ecs: duelECS.toJSON() });

	await Promise.all([
		pubsub.publish(firstTopic, { findMatch: { id: duel.id } }),
		pubsub.publish(secondTopic, { findMatch: { id: duel.id } }),
	]);
};
