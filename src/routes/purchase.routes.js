import { Router } from "express";
import {
  getPurchases,
  createPurchase,
  updatePurchaseById,
  deletePurchaseById,
  getPurchaseById,
  searchPurchases,
  payOffPurchase
} from "../controllers/purchase.controller.js";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verifyToken, getPurchases);

router.get("/:purchaseId", verifyToken, getPurchaseById);

router.put("/payOff/:purchaseId", verifyToken, payOffPurchase);

router.get("/search/:data", verifyToken, searchPurchases);

router.post("/", verifyToken, createPurchase);

router.put("/:purchaseId", verifyToken, updatePurchaseById);

router.delete("/:purchaseId", verifyToken, deletePurchaseById);

export default router;
