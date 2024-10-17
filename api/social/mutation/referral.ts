import { Referral } from 'models/referral';
import { User } from 'models/user';
import { requiredChain, requireUser } from 'utils/context';
import { ClientError } from 'utils/errors';
import type { MutationResolvers } from 'utils/types';

export const makeReferral: MutationResolvers['makeReferral'] = requiredChain(
	[requireUser],
	async (root, { referralCode }, { user }) => {
		const referrer = await User.findOne({ referralCode });
		if (!referrer?.id) {
			throw new ClientError('Referral code is invalid');
		}

		const referralPoints = 80;

		await Referral.create({
			referrerId: referrer.id,
			refereeId: user.id,
			claimedPoints: referralPoints,
		}).catch((error) => {
			if (error.message.includes('duplicate key error')) {
				throw new ClientError(
					'Can not make new referral cause referral already existed',
				);
			}
		});

		await User.updateOne(
			{ _id: referrer._id },
			{ $inc: { points: referralPoints } },
		);

		return true;
	},
);
