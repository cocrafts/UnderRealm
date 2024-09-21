import type { ContextFunction } from '@apollo/server';
import { type IUser, User } from 'models/user';
import { generateRandomCode, REFERRAL_CODE_LENGTH } from 'utils/common';

import { UnauthorizedError } from '../errors';

import { verifyToken } from './jwt';

export type UserProfile = IUser;

export type ApiContext = {
	user: UserProfile;
};

export const graphqlContext: ContextFunction<unknown[], ApiContext> = async ({
	event,
	req,
}) => {
	const headers = event?.headers || req?.headers || {};
	const auth: string = headers['Authorization'] || headers['authorization'];

	if (!auth) throw new UnauthorizedError('require Authorization token');

	const token = auth.replace('Bearer ', '');
	const cognitoUser = await verifyToken(token);

	let user: IUser = await User.findOne({ bindingId: cognitoUser.username });

	if (!user) {
		user = await User.create({
			bindingId: cognitoUser.username,
			address: cognitoUser.wallet,
			email: cognitoUser.email,
			referralCode: generateRandomCode(REFERRAL_CODE_LENGTH),
		});
	}

	return { user };
};
