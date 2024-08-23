import type { PermissionRoles, Workspace } from '@src/models/Workspace';

export const validatePermissionVault = (
  workspace: Workspace,
  user_id: string,
  predicate_id: string,
  permission: PermissionRoles,
) => {
  return (
    workspace.permissions[user_id][permission].includes(predicate_id) ?? false
  );
};

export const validatePermissionGeneral = (
  workspace: Workspace,
  user_id: string,
  permission: PermissionRoles[],
) => {
  if (permission.length === 0) return true;

  const permissions = !!workspace.permissions[user_id];

  const validate =
    permission.filter((p) => workspace.permissions[user_id][p]?.includes('*'))
      .length > 0;
  return validate && permissions;
};
