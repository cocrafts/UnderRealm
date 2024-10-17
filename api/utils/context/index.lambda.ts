import type { ContextFunction } from '@apollo/server';
import type { LambdaContextFunctionArgument } from '@as-integrations/aws-lambda';
import type { handlers } from '@as-integrations/aws-lambda';
import type {
	APIGatewayProxyEventV2,
	APIGatewayProxyStructuredResultV2,
} from 'aws-lambda';
import { configs } from 'utils/config';

import type { ApiContext } from './graphql';
import { resolveAuthContext } from './graphql';

type LambdaIntegrationContext = LambdaContextFunctionArgument<
	handlers.RequestHandler<
		APIGatewayProxyEventV2,
		APIGatewayProxyStructuredResultV2
	>
>;

export * from './graphql';

/**
 * Context wrapper for Lambda runtime
 */
export const graphqlContext: ContextFunction<
	[LambdaIntegrationContext],
	ApiContext
> = async ({ event }) => {
	const authHeader = event.headers['authorization'];

	const context = await resolveAuthContext({
		authHeader,
	});

	return context;
};

if (configs.RUNTIME !== 'lambda')
	throw Error('global context is only used by Lambda runtime');

type GlobalContext = {
	/**
	 * userId is set by graphql context for each request
	 */
	userId?: string;
	/**
	 * connectionId is set by websocket handler for each ws event
	 */
	connectionId?: string;
	subscriptionId?: string;
};

/**
 * This global context is used as request context as Lambda runtime serves only 1 request at a time
 */
export const globalContext: GlobalContext = {};
