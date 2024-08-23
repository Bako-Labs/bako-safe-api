import {
  HttpError,
  RESULT_TYPE,
  getGraphQLParameters,
  stopAsyncIteration,
} from '@graphql-sse/server';
import type express from 'express';
import {
  GraphQLError,
  getOperationAST,
  parse,
  subscribe,
  validate,
} from 'graphql';
import { type ExecutionResult, isAsyncIterable } from 'graphql-sse';

// https://github.com/faboulaws/graphql-sse/blob/main/libs/server/src/process-subscription.ts
async function processSubscription({
  operationName,
  query,
  variables,
  context,
  schema,
}) {
  try {
    // Parse
    let document;
    try {
      document =
        typeof query !== 'string' && query.kind === 'Document'
          ? query
          : parse(query);
    } catch (syntaxError) {
      throw new HttpError(
        400,
        'Unexpected error encountered while executing GraphQL request.',
        {
          graphqlErrors: [syntaxError],
        },
      );
    }

    // Validate
    const validationErrors = validate(schema, document);
    if (validationErrors.length > 0) {
      throw new HttpError(
        400,
        'Unexpected error encountered while executing GraphQL request.',
        {
          graphqlErrors: validationErrors,
        },
      );
    }

    const operation = getOperationAST(document, operationName);

    if (!operation) {
      if (!operation) {
        throw new HttpError(
          400,
          'Could not determine what operation to execute.',
        );
      }
    }

    if (operation.operation !== 'subscription') {
      return { type: RESULT_TYPE.NOT_SUBSCRIPTION };
    }

    const result = await subscribe({
      schema,
      document,
      operationName,
      variableValues: variables,
      contextValue: context,
    });

    if (isAsyncIterable<ExecutionResult>(result)) {
      return {
        type: RESULT_TYPE.EVENT_STREAM,
        subscribe: async (onResult) => {
          for await (const payload of result) {
            onResult(payload);
          }
        },
        unsubscribe: () => {
          stopAsyncIteration(result);
        },
      };
    }
    return {
      type: RESULT_TYPE.EVENT_STREAM,
      subscribe: async (onResult) => {
        onResult(result);
      },
      unsubscribe: () => undefined,
    };
  } catch (error) {
    const payload = {
      errors: error.graphqlErrors || [new GraphQLError(error.message)],
    };
    return {
      type: RESULT_TYPE.ERROR,
      status: error.status || 500,
      headers: error.headers || [],
      payload,
    };
  }
}

export const createSubscriptionHandler = ({ schema, defaultContext }) => {
  return async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    // @ts-ignore
    const graphQLParameters = getGraphQLParameters(req);
    if (!graphQLParameters.query) return next();

    try {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      const result = await processSubscription({
        operationName: graphQLParameters.operationName,
        query: graphQLParameters.query,
        variables: graphQLParameters.variables,
        schema,
        // @ts-ignore
        context: { schema, ...req.context, ...defaultContext },
      });

      if (result.type === RESULT_TYPE.EVENT_STREAM) {
        const subscription = result.subscribe((data) => {
          res.write(`data: ${JSON.stringify(data)}\n\n`);
        });

        req.on('close', () => {
          result.unsubscribe();
        });

        await subscription;
      }
    } catch (e) {
      // req.emit('close');
      return next(
        new GraphQLError(e.message, {
          path: [graphQLParameters.operationName],
        }),
      );
    }
  };
};
