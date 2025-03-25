const Joi = require("joi");
var express = require("express");
var router = express.Router();
const prisma = require("@/utils/db");
const { getUserId } = require("@/utils/tools");
const { encrypt, verify } = require("@/utils/password");
const { Response } = require("@/utils/response");
const { resValidate } = require("@/middleware/validate");

async function getReserLogByMobile(mobile, res) {
  try {
    const allReservationLogs = await prisma.reservationLog.findMany({
      select: {
        id: true,
        status: true,
        createdAt: true,
        title: true,
        memberList: true,
      },
    });
    let filterLogs;
    filterLogs = allReservationLogs.filter((log) => {
      // 确保 memberList 是数组
      const members = Array.isArray(log.memberList) ? log.memberList : [];
      // 检查是否有成员的手机号匹配
      return members.some((member) => member.mobile === mobile);
    });
    const result = filterLogs.map(({ memberList, ...rest }) => rest);
    if (filterLogs && filterLogs.length > 0) {
      res.json(
        Response.success({
          list: result,
        })
      );
    } else {
      res.json(
        Response.success({
          list: [],
        })
      );
    }
  } catch (error) {
    res.json(Response.fail("查询失败"));
    return;
  }
}

router.get(
  "/",
  resValidate(
    Joi.object({
      title: Joi.string().optional(),
      mobile: Joi.string().optional(),
      page: Joi.number().optional(),
      pageSize: Joi.number().optional(),
      userId: Joi.string().optional(),
      rid: Joi.string().optional(),
    }),
    "query"
  ),
  async function (req, res, next) {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      const where = {};
      if (req.query.title) {
        where.title = {
          contains: req.query.title,
        };
      }
      if (req.query.rid) {
        where.id = req.query.rid;
      }
      if (req.query.mobile) {
        await getReserLogByMobile(req.query.mobile, res);
        return;
      }
      const count = await prisma.reservationLog.count({
        where,
      });
      const list = await prisma.reservationLog.findMany({
        skip: (page * 1 - 1) * pageSize,
        take: parseInt(pageSize),
        where,
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          status: true,
          createdAt: true,
          title: true,
          memberList: true,
          user: {
            select: {
              userName: true,
              id: true,
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        // include: {
        //   user: {
        //     select: {
        //       userName: true,
        //       id: true,
        //       role: {
        //         select: {
        //           name: true,
        //         },
        //       },
        //     },
        //   },
        // },
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
        res.json(
          Response.success({
            list: [],
            page,
            pageSize,
            total: count,
          })
        );
      }
    } catch (error) {
      console.error("获取预约列表失败:", error);
      res.json(Response.fail("获取预约列表失败: " + error.message));
    }
  }
);

router.post(
  "/",
  resValidate(
    Joi.object({
      rid: Joi.string().required(),
      mobile: Joi.string().required(),
    }),
    "body"
  ),
  async function (req, res, next) {
    try {
      const { mobile, rid } = req.body;
      const userId = getUserId(req.headers.authorization.split(" ")[1]);
      const name = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          userName: true,
        },
      });
      if (!name) {
        res.json(Response.fail("获取用户名失败"));
        return;
      }
      const reservation = await prisma.reservation.findUnique({
        where: {
          id: rid,
        },
      });
      if (!reservation) {
        res.json(Response.fail("获取预约信息失败"));
        return;
      }
      // 查找是否已存在该预约的记录
      const existingLog = await prisma.reservationLog.findFirst({
        where: {
          reservationId: rid,
        },
      });

      let result;
      if (existingLog) {
        const currentMembers = existingLog.memberList || [];
        const newMember = {
          name: name.userName,
          mobile,
        };
        // 检查是否已经存在相同的用户
        const memberExists = currentMembers.some(
          (member) =>
            member.name === newMember.name && member.mobile === newMember.mobile
        );
        if (!memberExists) {
          result = await prisma.reservationLog.update({
            where: {
              id: existingLog.id,
            },
            data: {
              memberList: [...currentMembers, newMember],
            },
            select: {
              id: true,
              title: true,
              address: true,
              status: true,
            },
          });
          res.json(Response.success(result));
        } else {
          res.json(Response.fail("该用户已存在"));
          return;
        }
      } else {
        result = await prisma.reservationLog.create({
          data: {
            memberList: [
              {
                name: name.userName,
                mobile,
              },
            ],
            // 使用 user 关系而不是 userId
            user: {
              connect: {
                id: userId,
              },
            },
            // 使用 Reservation 关系而不是 reservationId
            Reservation: {
              connect: {
                id: rid,
              },
            },
            content: reservation.content || "",
            desc: reservation.desc || "",
            title: reservation.title || "",
            createdAt: new Date(),
          },
        });
        res.json(Response.success(result));
      }
    } catch (error) {
      console.error("添加预约失败:", error);
      res.json(Response.fail("添加预约失败: " + error.message));
    }
  }
);

module.exports = router;
