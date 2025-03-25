const fs = require("fs");
const Joi = require("joi");
var express = require("express");
var router = express.Router();
const multert = require("multer");
const { parseData, getQrCode } = require("../../../utils/tools");
const { Response } = require("@/utils/response");
const { resValidate } = require("@/middleware/validate");

if (!fs.existsSync("./public/uploads")) {
  fs.mkdirSync("./public/uploads", {
    recursive: true,
  });
}

const storage = multert.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.filename + "-" + Date.now());
  },
});

const upload = multert({ storage: storage });

router.post("/upload", upload.single("file"), (req, res, next) => {
  res.json(parseData("/uploads/" + req.file.filename));
});

router.get(
  "/qrcode",
  resValidate(
    Joi.object({
      code: Joi.string().required(),
    }),
    "query"
  ),
  async (req, res) => {
    try {
      const data = req.query.code;
      const qrcode = await getQrCode(data);
      res.json(Response.success(qrcode));
    } catch (error) {
      console.error("二维码生成失败:", error);
      res.json(Response.fail("生成二维码失败: " + error.message));
    }
  }
);

module.exports = router;
