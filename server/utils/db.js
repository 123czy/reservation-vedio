const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// 测试数据库连接
prisma
  .$connect()
  .then(() => {
    console.log("数据库连接成功");
  })
  .catch((error) => {
    console.error("数据库连接失败:", error);
  });

module.exports = prisma;
