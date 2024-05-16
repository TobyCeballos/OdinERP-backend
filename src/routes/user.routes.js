import { Router } from "express";
import { createUser, getUser, getUsers, toggleUserState,  } from "../controllers/user.controller.js";
import { isAdmin, verifyToken } from "../middlewares/authJwt.js";
import { checkExistingUser } from "../middlewares/verifySignup.js";
const router = Router();

router.post("/", [verifyToken, isAdmin, checkExistingUser], createUser);
router.get("/:userId", verifyToken,getUser);
router.get("/:company/list", verifyToken,getUsers);
router.get("/state-handler/:userId", verifyToken, toggleUserState);

export default router;
