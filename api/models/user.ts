import { model } from 'mongoose';
import {
	generateRandomCode,
	getRandomAvatar,
	REFERRAL_CODE_LENGTH,
} from 'utils/common';

import { createSchema } from './utils';

export type IUser = {
	id: string;
	bindingId: string;
	name?: string;
	address?: string;
	email?: string;
	avatarUrl?: string;
	referralCode: string;
	points: number;
	winMatches: number;
	totalMatches: number;
	discordId?: string;
	twitterId?: string;
	telegramId?: string;
	createdAt: Date;
	updatedAt: Date;
};

const UserSchema = createSchema({
	/** bindingId is used to bind this user with dynamodb profile (will be deprecated soon) */
	bindingId: {
		type: String,
		index: true,
		unique: true,
		required: true,
	},
	points: {
		type: Number,
		min: 0,
		default: 0,
	},
	referralCode: {
		type: String,
		index: true,
		unique: true,
	},
	address: {
		type: String,
		index: true,
	},
	name: String,
	email: {
		type: String,
		index: true,
	},
	winMatches: {
		type: Number,
		min: 0,
		default: 0,
	},
	totalMatches: {
		type: Number,
		min: 0,
		default: 0,
	},
	avatarUrl: String,
	discordId: {
		type: String,
		unique: true,
	},
	twitterId: {
		type: String,
		unique: true,
	},
	telegramId: {
		type: String,
		unique: true,
	},
});

UserSchema.pre('save', function (next) {
	if (!this.avatarUrl) {
		this.avatarUrl = getRandomAvatar();
	}
	if (!this.referralCode) {
		this.referralCode = generateRandomCode(REFERRAL_CODE_LENGTH);
	}

	next();
});

export const User = model<IUser>('User', UserSchema);

export async function updateWinner(userId: string, stakingPoints: number) {
	return User.findByIdAndUpdate(
		userId,
		{ $inc: { points: stakingPoints, winMatches: 1, totalMatches: 1 } },
		{ new: true },
	);
}

export async function updateLoser(userId: string) {
	return User.findByIdAndUpdate(
		userId,
		{ $inc: { totalMatches: 1 } },
		{ new: true },
	);
}
