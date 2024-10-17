import { Quest } from 'models/quest';
import type { IUser } from 'models/user';
import { virtualId } from 'models/utils';
import { Types } from 'mongoose';
import { requiredChain, requireUser } from 'utils/context';
import type { QueryResolvers } from 'utils/types';
import { QuestStatus } from 'utils/types';

export const quests: QueryResolvers['quests'] = requiredChain(
	[requireUser],
	async (_, { status }, { user }) => {
		if (!user) {
			return await Quest.find({ status: status || QuestStatus.Live });
		} else {
			return await getQuestsWithAction(status, user);
		}
	},
);

const getQuestsWithAction = async (status: QuestStatus, user: IUser) => {
	// TODO: this aggregate should follow resolver chains
	const userId = Types.ObjectId.createFromHexString(user.id);
	let quests = await Quest.aggregate([
		{
			$match: { status: status || QuestStatus.Live },
		},
		{
			$lookup: {
				from: 'questactions',
				let: { questId: '$_id' },
				pipeline: [
					{
						$match: {
							$expr: {
								$and: [
									{ $eq: ['$$questId', '$questId'] },
									{ $eq: ['$userId', userId] },
								],
							},
						},
					},
					{ $limit: 1 },
				],
				as: 'questAction',
			},
		},
		{ $addFields: { action: { $arrayElemAt: ['$questAction', 0] } } },
		{ $addFields: { action: { $ifNull: ['$questAction', null] } } },
	]);

	quests = quests.map((quest) => {
		const action = quest?.action?.length > 0 ? quest.action[0] : null;
		return { ...virtualId(quest), action: virtualId(action) };
	});

	return quests;
};
