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

router.get("/:company/", verifyToken, getSells);

router.get("/:company/:sellId", verifyToken, getSellById);

router.put("/:company/payOff/:sellId", verifyToken, payOffSell);

router.get("/:company/search/:data", verifyToken, searchSells);

router.post("/:company/", verifyToken, createSell);

router.put("/:company/:sellId", verifyToken, updateSellById);

router.delete("/:company/:sellId", verifyToken, deleteSellById);

export default router;
