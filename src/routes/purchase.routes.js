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

router.get("/:company/", verifyToken, getPurchases);

router.get("/:company/:purchaseId", verifyToken, getPurchaseById);

router.put("/:company/payOff/:purchaseId", verifyToken, payOffPurchase);

router.get("/:company/search/:data", verifyToken, searchPurchases);

router.post("/:company/", verifyToken, createPurchase);

router.put("/:company/:purchaseId", verifyToken, updatePurchaseById);

router.delete("/:company/:purchaseId", verifyToken, deletePurchaseById);

export default router;
