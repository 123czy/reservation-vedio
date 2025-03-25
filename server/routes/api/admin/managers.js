/**
 * 格式化时间
 * @param {*} time
 * @returns
 */
const router = require("express").Router();
const prisma = require("@/utils/db");
const { encrypt, verify } = require("@/utils/password");
const { parseData, getUserId, generateToken } = require("@/utils/tools");
const { withPrismaValidation } = require("@/utils/validator");
/* GET users listing. */
router.get("/", async (req, res, next) => {
  const { page = 1, pageSize = 10 } = req.query;
  const count = await prisma.manager.count({});
  const list = await prisma.manager.findMany({
    skip: (page * 1 - 1) * pageSize,
    take: parseInt(pageSize),
    where: {},
    orderBy: {
      createdAt: "desc",
    },
  });
  res.json(
    parseData(
      {
        list: list.map((item) => {
          delete item.password;
          return item;
        }),
        count,
        page,
        pages: Math.ceil(count / pageSize),
      },
      true,
      "获取成功"
    )
  );
});

// 获取当前用户信息 包括token
router.get("/info", async (req, res, next) => {
  const id = getUserId(req.headers.authorization.split(" ")[1]);
  const result = await prisma.manager.findFirst({
    where: {
      id,
    },
  });
  delete result.password;
  res.json(
    parseData(
      {
        result,
      },
      true,
      "获取成功"
    )
  );
});

// 获取单个记录 不包含密码
router.get("/:id", function (req, res, next) {
  res.send("respond with a resource");
});

// userName  String   @unique @map("user_name")
// password  String
// nickName  String?  @map("nick_name")
// avatar    String?

router.post("/create", async (req, res) => {
  try {
    const { userName, password, nickName, avatar } = req.body;
    const hash = await encrypt(password);
    const result = await prisma.manager.create({
      data: {
        userName,
        password: hash,
        nickName,
        avatar,
      },
      select: {
        id: true,
        userName: true,
        nickName: true,
        avatar: true,
      },
    });
    res.json(parseData(result, true, "创建成功"));
  } catch (error) {
    console.log(error);
    res.json(parseData(null, false, error.message));
  }
});

/**
 * 根据id修改记录
 */
router.post(
  "/:id",
  withPrismaValidation(
    async (req) => {
      return await prisma.manager.update({
        where: {
          id: req.params.id,
        },
        data: {
          nickName: req.body.nickName,
          avatar: req.body.avatar,
        },
      });
    },
    ["nickName", "avatar"]
  )
);
/**
 * 根据id修改密码
 */
router.post(
  "/:id/reset_pwd",
  withPrismaValidation(
    async (req) => {
      const { password } = req.body;
      const hash = await encrypt(password);
      return await prisma.manager.update({
        where: {
          id: req.params.id,
        },
        data: {
          password: hash,
        },
      });
    },
    ["password"]
  )
);

/**
 *删除多个 使用url传参数 ？name=1,2,3
 */
router.delete("/delete_many", async (req, res) => {
  const { time } = req.body;
});

/**
 * 根据id删除记录
 */
router.delete(
  "/:id",
  withPrismaValidation(
    async (req) => {
      return await prisma.manager.delete({
        where: {
          id: req.params.id,
        },
      });
    },
    [],
    {
      hideData: true,
      successMessage: "删除成功",
    }
  )
);

module.exports = router;
