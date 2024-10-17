import type { ContextFunction } from '@apollo/server';
import type { ExpressContextFunctionArgument } from '@apollo/server/dist/esm/express4';
import type { ResolverFn } from 'utils/types';

import type { ApiContext } from './graphql';

export * from './graphql';

export const graphqlContext: ContextFunction<
	[ExpressContextFunctionArgument],
	ApiContext
> = async ({ req }) => {
	const authHeader: string = req?.headers['authorization'];
	const nonce: string = Array.isArray(req?.headers['nonce'])
		? req.headers['nonce'][0] // If it's an array, take the first element
		: req?.headers['nonce'] || '';
	return { nonce: nonce, auth: authHeader };
};

/**
 * Applies a chain of middlewares to a given resolver function.
 *
 * `requiredChain` receives a list of middlewares that will be called before the main resolver.
 * The order in which the middlewares are called will be from the beginning of the array to the end.
 *
 * @template TResult - The type of the return value of the resolver.
 * @template TParent - The type of the parent object in the resolver.
 * @template TArgs - The type of the arguments for the resolver.
 *
 * @param {Array<Function>} middlewares - An array of middleware functions that modify the resolver. Each middleware
 * takes a resolver function as input and returns a modified resolver function.
 *
 * @param {Function} resolver - The original resolver function to which the middlewares will be applied.
 *
 * @returns {Function} A new resolver function that wraps the original resolver with the specified middlewares.
 *
 * @async
 * @throws {Error} If any middleware or resolver function throws an error during execution.
 */
export const requiredChain = <TResult, TParent, TArgs>(
	middlewares: Array<
		(
			resolver: ResolverFn<TResult, TParent, ApiContext, TArgs>,
		) => ResolverFn<TResult, TParent, ApiContext, TArgs>
	>,
	resolver: ResolverFn<TResult, TParent, ApiContext, TArgs>, // The original resolver
): ResolverFn<TResult, TParent, ApiContext, TArgs> => {
	return async (root, args, context, info) => {
		let wrappedResolver = resolver;

		// Apply each middleware to the resolver in sequence
		for (let i = middlewares.length - 1; i >= 0; i--) {
			wrappedResolver = middlewares[i](wrappedResolver);
		}

		// Execute the final wrapped resolver
		return await wrappedResolver(root, args, context, info);
	};
};
