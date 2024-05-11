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

router.get("/:company/", verifyToken, getProviders);

router.get("/:company/:providerId", verifyToken, getProviderById);

router.get("/:company/search/:data", verifyToken, searchProviders);

router.post("/:company/automaticProvider/:providerName", verifyToken, createProvider);

router.post("/:company/", verifyToken, createProvider);

router.put("/:company/:providerId", verifyToken, updateProviderById);

router.delete("/:company/:providerId", [verifyToken, isAdmin], deleteProviderById);

export default router;
