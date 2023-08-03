const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");

require("dotenv").config();
const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
  })
);
app.use(helmet());
app.use(morgan("common"));
app.use(express.json());

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGO_DB).then(
  () => {
    console.log("connected to the DB");
  },
  (err) => {
    console.log(err);
  }
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT} port`);
});
