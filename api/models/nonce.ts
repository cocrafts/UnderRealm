import type { ObjectId } from 'mongoose';
import { model, Types } from 'mongoose';
import { NONCE_TIMEOUT_IN_MINUTES } from 'utils/common';
import { MIN_IN_MS } from 'utils/common/date';
import { v4 as uuidv4 } from 'uuid';

import type { IUser } from './user';
import { createSchema } from './utils';

export type IRequestNonce = {
	userId: ObjectId;
	nonce: string;
	expiredAt: Date;
	createdAt: Date;
};

const RequestNonceSchema = createSchema({
	userId: { type: Types.ObjectId, ref: 'User', required: true },
	nonce: { type: String, required: true },
	expiredAt: {
		type: Date,
		required: true,
		expires: 0,
		default: () => {
			return new Date(Date.now() + NONCE_TIMEOUT_IN_MINUTES * MIN_IN_MS);
		},
	},
});

RequestNonceSchema.index({ userId: 1, nonce: 1 }, { unique: true });
export const RequestNonce = model<IRequestNonce>('Nonce', RequestNonceSchema);

export const generateRequestNonce = async (user: IUser) => {
	const nonce: string = uuidv4();
	const result = await RequestNonce.create({
		userId: user.id,
		nonce: nonce,
	});
	return result.nonce;
};

export const checkRequestNonce = async (
	user: IUser,
	nonce: string,
): Promise<Boolean> => {
	const result = await RequestNonce.findOneAndDelete({
		nonce: nonce,
		userId: new Types.ObjectId(user.id),
	});
	return result != undefined;
};
