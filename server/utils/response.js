const SUCCESS = { code: 200, message: "success" }; // 成功
const FAILED = { code: 500, message: "fail" }; // 失败
const VALIDATE_FAILED = { code: 400, message: "param validate failed" }; // 参数验证失败
const AUTHORIZE_FAILED = { code: 401, message: "authorize failed" }; // 授权失败
const ACCESS_DENIED = { code: 403, message: "access denied" }; // 禁止访问
const API_NOT_FOUNT = { code: 404, message: "api does not exist" }; // api不存在

class Response {
  /**
   * 返回code
   */
  code;
  /**
   * 返回说明
   */
  message;
  /**
   * 返回数据
   */
  data;

  /**
   *
   * @param {number} code 返回code
   * @param {string} message 返回说明
   * @param {any} data 返回数据
   */
  constructor(code, message, data) {
    this.code = code;
    this.message = message || "";
    this.data = data || null;
  }

  /**
   * 成功
   * @param {*} data
   */
  static success(data) {
    return new Response(SUCCESS.code, SUCCESS.message, data);
  }

  /**
   * 失败
   * @param {*} messagge
   */
  static fail(message = "") {
    return new Response(FAILED.code, FAILED.message + ": " + message);
  }

  /**
   * 参数校验失败
   * @param {*} keys
   */
  static validateFailed(keys) {
    return new Response(
      VALIDATE_FAILED.code,
      VALIDATE_FAILED.message + `${keys ? ": " + keys : ""}`
    );
  }

  /**
   * 授权失败
   */
  static authorizeFailed() {
    return new Response(AUTHORIZE_FAILED.code, AUTHORIZE_FAILED.message);
  }

  /**
   * 禁止访问
   */
  static accessDenied() {
    return new Response(ACCESS_DENIED.code, ACCESS_DENIED.message);
  }

  /**
   * 接口不存在
   */
  static apiNotFound() {
    return new Response(API_NOT_FOUNT.code, API_NOT_FOUNT.message);
  }
}

module.exports = { Response };
