import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProductByIdOnBuy,
  updateProductByIdOnSell,
  deleteProductById,
  getProductById,
  searchProducts,
  updateProductById
} from "../controllers/products.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/:company/",verifyToken, getProducts);

router.get("/:company/:productId",verifyToken, getProductById);

router.get("/:company/search/:data",verifyToken, searchProducts);

router.post("/:company/", verifyToken, createProduct);

router.put("/:company/:productId", verifyToken, updateProductById);

router.put("/:company/:productId/on-buy", verifyToken, updateProductByIdOnBuy);
router.put("/:company/:productId/on-sell", verifyToken, updateProductByIdOnSell);

router.delete("/:company/:productId", [verifyToken, isAdmin], deleteProductById);

export default router;
