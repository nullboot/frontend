// Cookies 操作封装
import Cookies from "js-cookie";

export const cookieGetToken = () => Cookies.get("token");
export const cookieSetToken = (token: string) => Cookies.set("token", token);
export const cookieGetId = () => Number(Cookies.get("id"));
export const cookieSetId = (id: number) => Cookies.set("id", id.toString());
export const cookieClear = () => {
  Cookies.remove("token");
  Cookies.remove("id");
};
