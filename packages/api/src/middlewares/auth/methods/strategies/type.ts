import type { Request } from 'express';

import type { User, Workspace } from '@src/models';

export type IValidatePathParams = { method: string; path: string };

export interface AuthStrategy {
  authenticate(req: Request): Promise<{ user: User; workspace: Workspace }>;
}
