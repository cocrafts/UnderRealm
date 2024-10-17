import { readFileSync } from 'fs';

import { ApolloServer } from '@apollo/server';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { NonceQueryResolvers } from 'nonce';
import { referred } from 'social/query/referral';
import { refereeUser } from 'user';
import { logger } from 'utils/logger';
import type { Resolvers } from 'utils/types';

import { UserMutationResolvers } from './user/index';
import {
	GameMutationResolvers,
	GameQueryResolvers,
	GameSubscriptionResolvers,
} from './game';
import { SocialMutationResolvers, SocialQueryResolvers } from './social';
import { UserQueryResolvers, UserSubscriptionResolvers } from './user';

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const resolvers: Resolvers = {
	Query: {
		...GameQueryResolvers,
		...SocialQueryResolvers,
		...UserQueryResolvers,
		...NonceQueryResolvers,
	},
	Mutation: {
		...GameMutationResolvers,
		...SocialMutationResolvers,
		...UserMutationResolvers,
	},
	Subscription: {
		...UserSubscriptionResolvers,
		...GameSubscriptionResolvers,
	},
	Profile: {
		referred,
	},
	ReferralHistory: {
		refereeUser,
	},
};

export const schema = makeExecutableSchema({ typeDefs, resolvers });

export const apolloServer = new ApolloServer({
	schema,
	formatError: (fError, error) => {
		const isServerIntentError =
			fError.extensions.code === ApolloServerErrorCode.INTERNAL_SERVER_ERROR;

		if (isServerIntentError) {
			logger.error(error);
		}

		return fError;
	},
});
