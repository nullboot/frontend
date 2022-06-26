import { defineAPI, defineDynamicAPI } from "@/api/wrapper";

export const updateUserProfile = defineDynamicAPI<
  Paths.UserControllerUpdateUserProfile.PathParameters,
  Paths.UserControllerUpdateUserProfile.RequestBody,
  Paths.UserControllerUpdateUserProfile.Responses.$201
>("user/{id}/profile", "post");

export const updateUserPassword = defineDynamicAPI<
  Paths.UserControllerUpdateUserPassword.PathParameters,
  Paths.UserControllerUpdateUserPassword.RequestBody,
  Paths.UserControllerUpdateUserPassword.Responses.$201
>("user/{id}/password", "post");

export const updateUserRoles = defineDynamicAPI<
  Paths.UserControllerUpdateUserRoles.PathParameters,
  Paths.UserControllerUpdateUserRoles.RequestBody,
  Paths.UserControllerUpdateUserRoles.Responses.$201
>("user/{id}/roles", "post");

export const createUser = defineAPI<
  Paths.UserControllerCreateUser.RequestBody,
  Paths.UserControllerCreateUser.Responses.$201
>("user/new", "post");

export const getUserProfile = defineDynamicAPI<
  Paths.UserControllerGetUserProfile.PathParameters,
  void,
  Paths.UserControllerGetUserProfile.Responses.$200
>("user/{id}/profile", "get");

export const getUserList = defineAPI<
  Paths.UserControllerGetUsers.QueryParameters,
  Paths.UserControllerGetUsers.Responses.$200
>("user", "get");
