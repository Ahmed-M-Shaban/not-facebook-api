require("dotenv").config();
require("express-async-errors");

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

const dbConn = require("./config/dbConn");
const { logger, logEvents } = require("./middleware/logger");
const corsOptions = require("./config/corsOptions");
const landingPage = require("./routes/root");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require("./routes/post");

const app = express();
const PORT = process.env.PORT || 8800;

dbConn();

//  Middlewares
app.use(logger);
app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));

app.use("/", landingPage);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);

app.all("*", notFound);
app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Database connected successfully");
  app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`);
  });
});
mongoose.connection.on("error", (error) => {
  console.log(error);
  logEvents(
    `${error.no}: ${error.code}\t${error.syscall}\t${error.hostname}`,
    "mongoErrorLog.log"
  );
});
