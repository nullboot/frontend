import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { get } from "lodash";
import NProgress from "nprogress";
import { cookieGetToken } from "@/utils/cookies";
import { APIError } from "@/api/error";

function createService() {
  const service = axios.create();
  // 请求拦截
  service.interceptors.request.use(
    // 发送请求
    (config) => {
      NProgress.start();
      return config;
    },
    // 请求失败
    (error) => {
      NProgress.done();
      return Promise.reject(error);
    },
  );
  // 响应拦截
  service.interceptors.response.use(
    // 2XX状态码
    (response) => {
      NProgress.done();
      return response.data;
    },
    // 非2XX状态码
    (error) => {
      NProgress.done();
      if (error?.response?.status) {
        const status = error.response.status;
        switch (status) {
          case 400:
            return Promise.reject(new APIError("400_BAD_REQUEST", error));
          case 401:
            return Promise.reject(new APIError("401_UNAUTHORIZED", error));
          case 403:
            return Promise.reject(new APIError("403_FORBIDDEN", error));
          case 404:
            return Promise.reject(new APIError("404_NOT_FOUND", error));
          case 500:
            return Promise.reject(new APIError("500_INTERNAL_SERVER_ERROR", error));
          case 502:
            return Promise.reject(new APIError("502_BAD_GATEWAY", error));
        }
      }
      return Promise.reject(error);
    },
  );
  return service;
}

function createRequest(service: AxiosInstance) {
  return function (config: AxiosRequestConfig) {
    const baseConfig = {
      headers: {
        Authorization: `Bearer ${cookieGetToken()}`,
        "Content-Type": get(config, "headers.Content-Type", "application/json"),
      },
      timeout: 5000,
      baseURL: "/api/",
      data: {},
    };
    return service(Object.assign(baseConfig, config));
  };
}

const service = createService();
const request = createRequest(service);
export { service, request };
