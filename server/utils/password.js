const bcrypt = require("bcryptjs");

// 加密密码
const encrypt = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// 验证密码
const verify = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

module.exports = {
  encrypt,
  verify,
};
