import { checkRequestNonce } from 'models/nonce';
import type { IUser } from 'models/user';
import { User } from 'models/user';
import { ForbiddenError } from 'utils/errors';
import type { ResolverFn } from 'utils/types';

import { verifyToken } from './jwt';

export type UserProfile = IUser;

export type WebsocketContext = {
	connectionId?: string;
};

export type AuthContext = {
	auth?: string;
};
export type UserContext = {
	user?: UserProfile;
};

export type NonceContext = {
	nonce?: string;
};

type NonceContextOptions = {
	nonce: string;
	user: UserProfile;
};

export type ApiContext = WebsocketContext &
	UserContext &
	NonceContext &
	AuthContext;

type AuthContextOptions = {
	authHeader?: string;
};

export const resolveAuthContext = async ({
	authHeader,
}: AuthContextOptions) => {
	let user: IUser;
	if (authHeader) {
		const token = authHeader.replace('Bearer ', '');
		const cognitoUser = await verifyToken(token);

		user = await User.findOne({ bindingId: cognitoUser.username });

		if (!user) {
			user = await User.create({
				bindingId: cognitoUser.username,
				address: cognitoUser.wallet,
				email: cognitoUser.email,
			});
		}
	}
	return { user };
};

export const resolveNonceContext = async ({
	nonce,
	user,
}: NonceContextOptions) => {
	return await checkRequestNonce(user, nonce);
};

export const requireUser = <TResult, TParent, TArgs>(
	resolver: ResolverFn<TResult, TParent, ApiContext, TArgs>,
): ResolverFn<TResult, TParent, ApiContext, TArgs> => {
	return async (root, parent, context, args) => {
		if (!context.auth) {
			throw new ForbiddenError('Require Authorization token');
		}

		if (context.user) {
			return resolver(root, parent, context, args);
		}

		const { user } = await resolveAuthContext({
			authHeader: context.auth,
		});

		if (!user) {
			throw new ForbiddenError('Failed to get user information');
		}
		return resolver(root, parent, { ...context, user: user }, args);
	};
};

export const requireNonce = <TResult, TParent, TArgs>(
	resolver: ResolverFn<TResult, TParent, ApiContext, TArgs>,
): ResolverFn<TResult, TParent, ApiContext, TArgs> => {
	return async (root, parent, context, args) => {
		const user = context.user;
		if (!user) {
			throw new ForbiddenError('Require User');
		}
		if (!context.nonce) {
			throw new ForbiddenError('Nonce is required');
		}

		const nonceCheckResult = await resolveNonceContext({
			nonce: context.nonce,
			user: user,
		});

		if (!nonceCheckResult) {
			throw new ForbiddenError('invalid Nonce');
		}

		return resolver(root, parent, context, args);
	};
};
