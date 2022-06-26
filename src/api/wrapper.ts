import { AxiosRequestConfig, Method } from "axios";
import { request } from "@/utils/service";
import { APIError } from "@/api/error";
import { formatString, PathParams } from "@/utils/string";

interface BaseResponseType {
  error?: string;
}

export function wrapRequest<ResponseType extends BaseResponseType>(config: AxiosRequestConfig) {
  return request(config)
    .catch((err) => {
      console.error(err);
      // 若已封装为APIError，则直接向上抛出
      if (err instanceof APIError) throw err;
      // 一定要先catch再then，否则then抛出的异常立刻就会被自己catch
      throw new APIError("NETWORK_ERROR", err);
    })
    .then((_res) => {
      const res = _res as any as ResponseType;
      if (res.error !== undefined) throw new APIError(res.error, res);
      return res; // 返回转换后的类型
    });
}

function handler<RequestType, ResponseType extends BaseResponseType>(url: string, method: Method, data: RequestType) {
  const config: AxiosRequestConfig =
    method === "get"
      ? {
          url: url,
          method: method,
          params: data, // 注意GET请求的参数是params
        }
      : {
          url: url,
          method: method,
          data,
        };
  return wrapRequest<ResponseType>(config);
}

export function defineAPI<RequestType, ResponseType extends BaseResponseType>(url: string, method: string) {
  return (data: RequestType) => handler<RequestType, ResponseType>(url, method as Method, data);
}

export function defineDynamicAPI<PathParamType, RequestType, ResponseType extends BaseResponseType>(
  url: string,
  method: string,
) {
  return (pathParams: PathParamType, data: RequestType) => {
    const newUrl = formatString(url, pathParams as any as PathParams); //修复在多次使用dynamicAPI时出现的路径参数不更新的问题
    return handler<RequestType, ResponseType>(newUrl, method as Method, data);
  };
}
