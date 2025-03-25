const { parseData } = require("./tools");

/**
 * 验证请求参数
 * @param {Object} req 请求对象
 * @param {Array} allowedFields 允许的字段列表
 * @returns {Object|null} 如果验证失败返回错误对象，验证成功返回 null
 */
const validateFields = (req, allowedFields) => {
  const updateFields = Object.keys(req.body);
  const invalidFields = updateFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return {
      status: 400,
      response: parseData(
        null,
        false,
        `参数错误：${invalidFields.join(
          ", "
        )} 不是有效的字段，只允许修改 ${allowedFields.join(", ")}`
      ),
    };
  }
  return null;
};

/**
 * Prisma 操作包装器
 * @param {Function} prismaOperation Prisma 操作函数
 * @param {Array} allowedFields 允许的字段列表
 * @returns {Function} 包装后的处理函数
 */
const withPrismaValidation = (
  prismaOperation,
  allowedFields = [],
  options = { hideData: false, successMessage: "操作成功" }
) => {
  return async (req, res) => {
    try {
      const validationError = validateFields(req, allowedFields);

      if (validationError) {
        return res
          .status(validationError.status)
          .json(validationError.response);
      }

      const result = await prismaOperation(req);
      res.json(
        parseData(
          options.hideData ? null : result,
          true,
          options.successMessage || "操作成功"
        )
      );
    } catch (error) {
      res
        .status(500)
        .json(parseData(null, false, `操作失败：${error.message}`));
    }
  };
};

module.exports = {
  validateFields,
  withPrismaValidation,
};
