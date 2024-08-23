import type { Resolvers } from '@/generated/types';

import { submit } from './submit';
import { submitAndAwait } from './submit-and-await';

export const resolvers: Resolvers = {
  Mutation: { submit },
  Subscription: { submitAndAwait },
};
