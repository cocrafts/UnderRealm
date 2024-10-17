import { Referral } from 'models/referral';
import { requiredChain, requireUser } from 'utils/context';
import type { ProfileResolvers, QueryResolvers } from 'utils/types';

export const referralHistory: QueryResolvers['referralHistory'] = requiredChain(
	[requireUser],
	async (root, _, { user }) => {
		return await Referral.find({ referrerId: user.id });
	},
);

export const referred: ProfileResolvers['referred'] = requiredChain(
	[requireUser],
	async (root, _, { user }) => {
		return await Referral.findOne({ refereeId: user.id });
	},
);
