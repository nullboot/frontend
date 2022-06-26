import { defineAPI } from "@/api/wrapper";

export const authLogin = defineAPI<Paths.AuthControllerLogin.RequestBody, Paths.AuthControllerLogin.Responses.$201>(
  "auth/login",
  "post",
);

export const authLogout = defineAPI<
  Paths.AuthControllerPostLogout.RequestBody,
  Paths.AuthControllerPostLogout.Responses.$201
>("auth/logout", "post");
