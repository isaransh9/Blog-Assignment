import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import blogRouter from "./routes/blog.routes.js";

const app = express();
dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server listening at port :${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDb Connection Failed", error);
  });

// Routes
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);
