require("module-alias/register");
const { parseData } = require("@/utils/tools");
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var commonRouter = require("./routes/api/v1/common");
var manageRouter = require("./routes/api/admin/managers");
var authRouter = require("./routes/api/v1/auth");
var reservationRouter = require("@/routes/api/admin/reservation");
var reservationLogRouter = require("@/routes/api/admin/reservationLogs");
var app = express();

const jwtCheck = require("express-jwt").expressjwt({
  secret: process.env.secret_key,
  algorithms: ["HS256"],
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors()); // 解决跨域问题
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/v1/common", commonRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin/*", jwtCheck); // 开启服务端验证
app.use("/api/v1/admin/managers", manageRouter);
app.use("/api/v1/admin/reservation", reservationRouter);
app.use("/api/v1/admin/reservationLog", reservationLogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  // res.render("error");
  res.json(parseData(err.message, false, "error", err.status || 500));
});

module.exports = app;
