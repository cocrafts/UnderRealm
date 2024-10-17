import { requiredChain, requireUser } from 'utils/context';
import type { QueryResolvers } from 'utils/types';

import { cardDuel, cardDuelHistory, cardDuelPlaying } from './query/duel';

const greeting: QueryResolvers['greeting'] = requiredChain(
	[requireUser],
	async (root, args, { user }) => {
		const userId = user.bindingId || 'Stranger';
		return `Welcome ${userId}!`;
	},
);

export { GameSubscriptionResolvers } from './subscription';

export const GameQueryResolvers = {
	greeting,
	cardDuelHistory,
	cardDuelPlaying,
	cardDuel,
};

export const GameMutationResolvers = {};
