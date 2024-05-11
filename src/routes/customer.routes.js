import { Router } from "express";
import {
  getCustomers,
  createCustomer,
  updateCustomerById,
  deleteCustomerById,
  getCustomerById,
  searchCustomers,
  addToCurrentAccountCart // Importa el nuevo controlador
} from "../controllers/customer.controller.js";
import { verifyToken, isAdmin } from "../middlewares/authJwt.js";

const router = Router();

router.get("/:company/", verifyToken, getCustomers);

router.get("/:company/:customerId", verifyToken, getCustomerById);

router.get("/:company/search/:data", verifyToken, searchCustomers);

router.post("/:company/automaticCustomer/:customerName", verifyToken, createCustomer);

router.post("/:company/", verifyToken, createCustomer);

router.put("/:company/:customerId", verifyToken, updateCustomerById);

router.delete("/:company/:customerId", [verifyToken, isAdmin], deleteCustomerById);

router.post("/:company/:customerId/addToCurrentAccountCart", verifyToken, addToCurrentAccountCart);

export default router;
