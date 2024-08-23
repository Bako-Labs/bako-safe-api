import { createGraphqlFetch } from '@/lib';
import { resolvers } from './resolvers';
import { defaultSchema, executableSchema } from './schema';

const httpExecutor = createGraphqlFetch();

// Schema for overrides subscriptions
export const subscriptionSchema = defaultSchema({
  resolvers,
});

// Schema for overrides mutations and queries
export const defaultSchemas = executableSchema(httpExecutor, { resolvers });
