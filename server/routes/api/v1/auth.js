const Joi = require("joi");
var express = require("express");
var router = express.Router();
const prisma = require("@/utils/db");
const { generateToken, getUserId } = require("@/utils/tools");
const { encrypt, verify } = require("@/utils/password");
const { Response } = require("@/utils/response");
const { resValidate } = require("@/middleware/validate");

// 通过token获取用户信息
router.get("/user_info", async function (req, res, next) {
  try {
    const id = getUserId(req.headers.authorization.split(" ")[1]);
    const user = await prisma.user.findFirst({
      where: {
        id,
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
      res.json(Response.fail("用户不存在"));
      return;
    }
    res.json(Response.success(user));
  } catch (error) {
    console.error("获取用户信息错误:", error);
    res.json(Response.fail("获取用户信息失败: " + error.message));
  }
});

router.post(
  "/user_signup",
  resValidate(
    Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().min(6).required(),
      roleId: Joi.number().optional(),
    }),
    "body"
  ),
  async function (req, res, next) {
    const userName = req.body.userName;
    if (await prisma.user.findFirst({ where: { userName } })) {
      res.json(Response.fail("用户名已存在"));
      return;
    }
    const password = await encrypt(req.body.password);

    try {
      const result = await prisma.user.create({
        data: {
          userName,
          password,
          // 如果提供了roleId，则关联角色
          roleId: req.body.roleId || 0,
        },
        // 使用正确的字段名称
        include: {
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      // 从结果中移除密码字段
      const { password: _, roleId: __, role, ...userWithoutPassword } = result;
      const userInfo = {
        ...userWithoutPassword,
        role: role?.name || "user",
      };
      res.json(Response.success(userInfo));
    } catch (error) {
      console.error("注册错误:", error);
      res.json(Response.fail("注册失败: " + error.message));
    }
  }
);

// 修改路由定义方式，使用中间件链式调用
// 用户登录
router.post(
  "/admin_login",
  // 先应用验证中间件
  resValidate(
    Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().min(6).required(),
    }),
    "body"
  ),
  // 然后是实际的处理函数
  async (req, res) => {
    try {
      const { userName, password } = req.body;
      const user = await prisma.user.findFirst({
        where: {
          userName,
        },
        select: {
          id: true,
          password: true,
          userName: true,
          avatar: true,
          role: {
            select: {
              name: true,
            },
          },
        },
      });

      // 如果用户不存在
      if (!user) {
        return res.json(Response.fail("用户名或密码错误0"));
      }

      // 验证密码
      const isPasswordValid = await verify(password, user.password);
      if (!isPasswordValid) {
        return res.json(Response.fail("用户名或密码错误2"));
      }

      // 从用户对象中删除密码字段
      const { password: _, ...userWithoutPassword } = user;

      // 生成 token
      const token = await generateToken(userWithoutPassword);

      // 返回结果
      res.json(
        Response.success({
          token,
          user: userWithoutPassword,
        })
      );
    } catch (error) {
      console.error("登录错误:", error);
      res.json(Response.fail("登录失败: " + error.message));
    }
  }
);

module.exports = router;
