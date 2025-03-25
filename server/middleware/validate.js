const { Response } = require("@/utils/response.js");
const resValidate = (rules, key = "query") => {
  return (req, res, next) => {
    const { error } = rules.validate(req[key]);
    if (error) {
      const err = error.details[0].message;
      return res.json(Response.validateFailed(err));
    }
    next();
  };
};

module.exports = {
  resValidate,
};
