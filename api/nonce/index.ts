import { generateRequestNonce } from 'models/nonce';
import { requiredChain, requireUser } from 'utils/context';
import { ClientError } from 'utils/errors';
import type { QueryResolvers } from 'utils/types';

const NonceQueryResolver: QueryResolvers['nonce'] = requiredChain(
	[requireUser],
	async (root, _, { user }) => {
		console.log('getting nonce', user);
		const nonce = await generateRequestNonce(user);
		if (!nonce) {
			throw new ClientError('failed to get nonce for userServerError');
		}
		return nonce;
	},
);

export const NonceQueryResolvers = { nonce: NonceQueryResolver };
