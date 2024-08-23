import type { PredicateVersion } from '@src/models';
import { predicateVersionMock } from '../predicateVersion';

export const generateInitialPredicateVersion = async (): Promise<
  Partial<PredicateVersion>
> => {
  return predicateVersionMock;
};
