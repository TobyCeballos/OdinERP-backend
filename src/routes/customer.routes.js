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

router.get("/", verifyToken, getCustomers);

router.get("/:customerId", verifyToken, getCustomerById);

router.get("/search/:data", verifyToken, searchCustomers);

router.post("/automaticCustomer/:customerName", verifyToken, createCustomer);

router.post("/", verifyToken, createCustomer);

router.put("/:customerId", verifyToken, updateCustomerById);

router.delete("/:customerId", [verifyToken, isAdmin], deleteCustomerById);

router.post("/:customerId/addToCurrentAccountCart", verifyToken, addToCurrentAccountCart);

export default router;
