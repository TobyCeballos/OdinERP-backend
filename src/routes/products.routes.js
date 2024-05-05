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

router.get("/",verifyToken, getProducts);

router.get("/:productId",verifyToken, getProductById);

router.get("/search/:data",verifyToken, searchProducts);

router.post("/", verifyToken, createProduct);

router.put("/:productId", verifyToken, updateProductById);

router.put("/:productId/on-buy", verifyToken, updateProductByIdOnBuy);
router.put("/:productId/on-sell", verifyToken, updateProductByIdOnSell);

router.delete("/:productId", [verifyToken, isAdmin], deleteProductById);

export default router;
