import { Router } from "express";
import {
  getProducts,
  createProduct,
  updateProductById,
  deleteProductById,
  getProductById,
  searchProducts
} from "../controllers/products.controller.js";
import { verifyToken, isModerator, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/",verifyToken, getProducts);

router.get("/:productId",verifyToken, getProductById);

router.get("/search/:data",verifyToken, searchProducts);

router.post("/", verifyToken, createProduct);


router.put("/:productId", verifyToken, updateProductById);

router.delete("/:productId", [verifyToken, isAdmin], deleteProductById);

export default router;
