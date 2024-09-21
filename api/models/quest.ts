import { model, Types } from 'mongoose';

import { createSchema } from './utils';

const questSchema = createSchema({
	title: String,
	description: String,
	type: {
		type: String,
		enum: ['LIKE_X', 'RETWEET_X', 'JOIN_DISCORD', 'COMMENT_X'],
	},
	status: {
		type: String,
		enum: ['INIT', 'LIVE', 'DISABLE'],
	},
	url: String,
	points: Number,
});

export const Quest = model('Quest', questSchema);

const questActionSchema = createSchema({
	questId: { type: Types.ObjectId, ref: 'Quest' },
	userId: { type: 'string', ref: 'User' },
	claimedPoints: Number,
});

questActionSchema.index({ questId: 1, userId: 1 }, { unique: true });

export const QuestAction = model('QuestAction', questActionSchema);
