import { getItem, rangeQuery } from 'utils/aws/dynamo';
import { requiredChain, requireUser } from 'utils/context';
import type { QueryResolvers } from 'utils/types';

export const cardDuelHistory: QueryResolvers['cardDuelHistory'] = requiredChain(
	[requireUser],
	async (root, { limit }, { user }) => {
		const { Items: duels } = await rangeQuery(
			'gsi',
			`profile#${user.bindingId}`,
			'duelHistory#',
			{ Limit: limit || 1, ScanIndexForward: false },
		);

		return duels;
	},
);

export const cardDuelPlaying = requiredChain(
	[requireUser],
	async (root, args, { user }) => {
		const { Items: duels } = await rangeQuery(
			'gsi',
			`profile#${user.id}`,
			'duelPlaying#',
			{ Limit: 1, ScanIndexForward: false },
		);

		return duels[0];
	},
);

export const cardDuel: QueryResolvers['cardDuel'] = async (root, { id }) => {
	const result = await getItem(`cardDuel#${id}`);
	return result.Item;
};
