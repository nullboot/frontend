import { defineDynamicAPI } from "@/api/wrapper";

export const getPermissions = defineDynamicAPI<
  Paths.PermissionControllerGetPermission.PathParameters,
  void,
  Paths.PermissionControllerGetPermission.Responses.$200
>("{role}/{id}/permission", "get");

export const setPermissions = defineDynamicAPI<
  Paths.PermissionControllerSetPermission.PathParameters,
  Paths.PermissionControllerSetPermission.RequestBody,
  Paths.PermissionControllerSetPermission.Responses.$201
>("{role}/{id}/permission", "post");
