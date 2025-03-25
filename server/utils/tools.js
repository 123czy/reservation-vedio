const jwt = require("jsonwebtoken");
const qrCode = require("qrcode");
/**
 *
 * @param {*} data
 * @param {*} success
 * @param {*} errorMessage
 * @param {*} errorCode
 * @returns
 */
function parseData(
  data = {},
  success = true,
  errorMessage = "",
  errorCode = ""
) {
  return {
    data,
    success,
    errorMessage,
    errorCode,
  };
}

function generateToken(user) {
  return new Promise((resolve, reject) => {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.secret_key,
      {
        expiresIn: "1d",
      }
    );
    resolve(token);
  }).catch((err) => {
    console.error("生成token错误:", err);
    throw err;
  });
}

function getUserId(token) {
  const decoded = jwt.verify(token, process.env.secret_key);
  return decoded.userId;
}

function getQrCode(data) {
  return new Promise((resolve, reject) => {
    qrCode.toDataURL(data, {}, (err, url) => {
      if (err) {
        console.error("生成二维码错误:", err);
        reject(err);
      } else {
        resolve(url);
      }
    });
  });
}

module.exports = {
  parseData,
  generateToken,
  getUserId,
  getQrCode,
};
