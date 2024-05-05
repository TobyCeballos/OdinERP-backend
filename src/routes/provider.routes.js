import { Router } from "express";
import {
  getProviders,
  createProvider,
  updateProviderById,
  deleteProviderById,
  getProviderById,
  searchProviders,
} from "../controllers/provider.controller.js";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/", verifyToken, getProviders);

router.get("/:providerId", verifyToken, getProviderById);

router.get("/search/:data", verifyToken, searchProviders);

router.post("/automaticProvider/:providerName", verifyToken, createProvider);

router.post("/", verifyToken, createProvider);

router.put("/:providerId", verifyToken, updateProviderById);

router.delete("/:providerId", [verifyToken, isAdmin], deleteProviderById);

export default router;
