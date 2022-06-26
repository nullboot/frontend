/*
 * 哲学：
 * API应返回Promise，并判断请求是否成功。
 * 当请求成功时，应做类型转换。
 * 当请求出错时，API应抛出APIError。
 * */

import { ElMessage } from "element-plus";

export class APIError extends Error {
  message: string;
  content: any;

  constructor(message: string, content: any = null) {
    super();
    this.message = message;
    this.content = content;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, APIError.prototype);
  }

  parseText(): string {
    switch (this.message) {
      // 请按字典序排序
      // TODO: 按照后端接口添加更多的文本
      case "400_BAD_REQUEST":
        return "请求参数错误 (400)";
      case "401_UNAUTHORIZED":
        return "未授权 (401)";
      case "403_FORBIDDEN":
        return "拒绝访问 (403)";
      case "404_NOT_FOUND":
        return "非法API (404)";
      case "500_INTERNAL_SERVER_ERROR":
        return "服务器内部错误 (500)";
      case "502_BAD_GATEWAY":
        return "服务器错误 (502)";

      case "ALREADY_LOGIN":
        return "重复登录";
      case "ALREADY_NOMINATED":
        return "重复提名";
      case "DUPLICATE_EMAIL":
        return "邮箱重复";
      case "DUPLICATE_USERNAME":
        return "用户名重复";
      case "NETWORK_ERROR":
        return "网络请求失败";
      case "NO_SUCH_COURSE":
        return "课程不存在";
      case "NO_SUCH_EXAM":
        return "考试不存在";
      case "NO_SUCH_USER":
        return "用户不存在";
      case "NO_SUCH_TUTOR":
        return "导师不存在";
      case "NO_SUCH_NEWBIE":
        return "新人不存在";
      case "NOT_LOGIN":
        return "尚未登陆";
      case "PERMISSION_DENIED":
        return "权限不足";
      case "TUTOR_NOT_GRADUATE":
        return "导师未毕业";
      case "TUTOR_NOT_APPROVED":
        return "导师未通过审核";
      case "WRONG_PASSWORD":
        return "密码错误";
      default:
        return `未知错误：${this.message}`;
    }
  }
}

export function showError(err: Error) {
  if (err instanceof APIError) ElMessage.error(err.parseText());
  else ElMessage.error(`其他错误：${err.message}`);
}
