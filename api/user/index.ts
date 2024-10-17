import { User } from 'models/user';
import { requiredChain, requireUser } from 'utils/context';
import { pubsub, topicGenerator } from 'utils/pubsub';
import type {
	QueryResolvers,
	ReferralHistoryResolvers,
	SubscriptionResolvers,
} from 'utils/types';

import type { MutationResolvers } from './../utils/types/graphql';

const profile: QueryResolvers['profile'] = requiredChain(
	[requireUser],

	async (root, _, { user }) => {
		return user;
	},
);

export const refereeUser: ReferralHistoryResolvers['refereeUser'] = async ({
	refereeId,
}) => {
	return await User.findById(refereeId);
};

export const updateProfile: MutationResolvers['updateProfile'] = requiredChain(
	[requireUser],
	async (_, { profileInput }, { user }) => {
		const userId = user.id;

		const updatedUser = await User.findByIdAndUpdate(
			{ _id: userId },
			profileInput,
			{ new: true },
		);

		return updatedUser;
	},
);

export const UserQueryResolvers = {
	profile,
};

const counterIncreased: SubscriptionResolvers['counterIncreased'] = {
	subscribe: async () => {
		return await pubsub.subscribe(topicGenerator.counterIncreased());
	},
};

export const UserSubscriptionResolvers = {
	counterIncreased,
};

export const UserMutationResolvers = {
	updateProfile,
};
