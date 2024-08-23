import { addMinutes } from 'date-fns';

import { RecoverCodeType, User } from '@src/models';
import type UserToken from '@src/models/UserToken';
import type { Workspace } from '@src/models/Workspace';
import GeneralError, { ErrorTypes } from '@src/utils/error/GeneralError';

import type { IAuthRequest } from '@middlewares/auth/types';

import { NotFound, error } from '@utils/error';
import { Responses, TokenUtils, bindMethods, successful } from '@utils/index';

import app from '@src/server/app';
import { RecoverCodeService } from '../recoverCode/services';
import { WorkspaceService } from '../workspace/services';
import type {
  IAuthService,
  IChangeWorkspaceRequest,
  ICreateRecoverCodeRequest,
  ISignInRequest,
} from './types';

export class AuthController {
  private authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
    bindMethods(this);
  }

  async signIn(req: ISignInRequest) {
    try {
      const { digest, encoder, signature } = req.body;

      const { userToken, signin } = await TokenUtils.createAuthToken(
        signature,
        digest,
        encoder,
      );

      await app._sessionCache.addSession(userToken.token, userToken);
      return successful(signin, Responses.Ok);
    } catch (e) {
      if (e instanceof GeneralError) throw e;

      return error(e.error, e.statusCode);
    }
  }

  async signOut(req: IAuthRequest) {
    try {
      const response = await this.authService.signOut(req.user);

      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async generateSignCode(req: ICreateRecoverCodeRequest) {
    try {
      const { address } = req.params;
      const { origin } = req.headers;
      const owner = await User.findOne({ where: { address } });

      const response = await new RecoverCodeService().create({
        owner,
        type: RecoverCodeType.AUTH,
        origin: origin ?? process.env.UI_URL,
        validAt: addMinutes(new Date(), 5),
      });

      return successful(response, Responses.Ok);
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }

  async updateWorkspace(req: IChangeWorkspaceRequest) {
    try {
      const { workspace: workspaceId, user } = req.body;
      const workspace = await new WorkspaceService()
        .filter({ id: workspaceId })
        .list()
        .then((response: Workspace[]) => response[0]);

      if (!workspace)
        throw new NotFound({
          type: ErrorTypes.NotFound,
          title: 'Workspace not found',
          detail: 'Workspace not found',
        });

      const isUserMember = workspace.members.find((m) => m.id === user);

      const token = await TokenUtils.getTokenBySignature(
        req.headers.authorization,
      );

      if (isUserMember) {
        token.workspace = workspace;
      }

      await app._sessionCache.addSession(token.token, token);

      return successful(
        await token.save().then(({ workspace, token, user }: UserToken) => {
          return {
            workspace: {
              id: workspace.id,
              name: workspace.name,
              avatar: workspace.avatar,
              permissions: workspace.permissions[user.id],
              single: workspace.single,
            },
            token: token,
            avatar: user.avatar,
            address: user.address,
          };
        }),
        Responses.Ok,
      );
    } catch (e) {
      return error(e.error, e.statusCode);
    }
  }
}
