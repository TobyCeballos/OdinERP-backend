import { Router } from "express";
import {
  getSells,
  createSell,
  updateSellById,
  deleteSellById,
  getSellById,
  searchSells,
  payOffSell
} from "../controllers/sells.controller.js";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verifyToken, getSells);

router.get("/:sellId", verifyToken, getSellById);

router.put("/payOff/:sellId", verifyToken, payOffSell);

router.get("/search/:data", verifyToken, searchSells);

router.post("/", verifyToken, createSell);

router.put("/:sellId", verifyToken, updateSellById);

router.delete("/:sellId", verifyToken, deleteSellById);

export default router;
