import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
const router = Router();

router.route("/signup").post(registerUser);

router.route("/signin").post(loginUser);

router.route("/signout").get(verifyJWT, logoutUser);

export default router;
