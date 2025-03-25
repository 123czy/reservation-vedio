const Joi = require("joi");
var express = require("express");
var router = express.Router();
const prisma = require("@/utils/db");
const { encrypt, verify } = require("@/utils/password");
const { Response } = require("@/utils/response");
const { resValidate } = require("@/middleware/validate");
const { getUserId } = require("@/utils/tools");

router.get(
  "/",
  resValidate(
    Joi.object({
      title: Joi.string().optional(),
      userName: Joi.string().optional(),
      page: Joi.number().optional(),
      pageSize: Joi.number().optional(),
      userId: Joi.string().optional(),
    }),
    "query"
  ),
  async function (req, res, next) {
    try {
      const { page = 1, pageSize = 10, userId, userName, title } = req.query;
      const where = {};
      if (title) {
        where.title = {
          contains: title,
        };
      }
      if (userId) {
        where.userId = userId;
      }
      if (userName) {
        where.userName = {
          contains: userName,
        };
      }
      const count = await prisma.reservation.count({
        where,
      });
      console.log("where", where);
      const list = await prisma.reservation.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          title: true,
          desc: true,
          content: true,
          maxCount: true,
          startAt: true,
          endAt: true,
          createdAt: true,
          user: {
            select: {
              userName: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });
      if (list && list.length > 0) {
        res.json(
          Response.success({
            list,
            page,
            pageSize,
            total: count,
          })
        );
      } else {
        res.json(Response.fail("获取用户列表失败"));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.post(
  "/",
  resValidate(
    Joi.object({
      title: Joi.string().required(), // 添加必要的字段
      desc: Joi.string().optional(),
      content: Joi.string().optional(),
      maxCount: Joi.number().optional(),
      startAt: Joi.date().optional(),
      endAt: Joi.date().optional(),
    }),
    "body"
  ),
  async function (req, res, next) {
    try {
      const userId = getUserId(req.headers.authorization?.split(" ")[1]);
      if (!userId) {
        return res.json(Response.fail("未登录"));
      }
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          id: true,
          userName: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!user) {
        return res.json(Response.fail("用户不存在"));
      }
      // 处理日期
      if (req.body.startAt) {
        req.body.startAt = new Date(req.body.startAt);
      }
      if (req.body.endAt) {
        req.body.endAt = new Date(req.body.endAt);
      }
      const reservation = await prisma.reservation.create({
        data: {
          title: req.body.title,
          desc: req.body.desc,
          content: req.body.content,
          maxCount: req.body.maxCount ? parseInt(req.body.maxCount) : 10,
          startAt: req.body.startAt,
          endAt: req.body.endAt,
          // 正确关联用户
          user: {
            connect: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          title: true,
          content: true,
          maxCount: true,
          startAt: true,
          endAt: true,
          createdAt: true,
          user: {
            select: {
              id: true,
              userName: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      if (reservation) {
        res.json(Response.success(reservation));
      } else {
        res.json(Response.fail("预约失败"));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

module.exports = router;
