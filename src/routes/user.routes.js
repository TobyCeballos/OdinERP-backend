import { Router } from "express";
import { createUser, getUser,  } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";

const router = Router();

router.post("/", [verifyToken, isAdmin, checkExistingUser], createUser);
router.get("/:userId", verifyToken,getUser);

export default router;
