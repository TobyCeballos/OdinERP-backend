import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

// Routes
import indexRoutes from "./routes/index.routes.js";
import productRoutes from "./routes/products.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import providersRoutes from "./routes/provider.routes.js";
import sellRoutes from "./routes/sell.routes.js";
import purchaseRoutes from "./routes/purchase.routes.js";
import usersRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Settings
app.set("port", process.env.PORT || 4000);
app.set("json spaces", 4);

// Middlewares
app.use(
  cors({
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api", indexRoutes);
app.use("/api/products", productRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/providers", providersRoutes);
app.use("/api/sells", sellRoutes);
app.use("/api/purchase", purchaseRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/auth", authRoutes);


export default app;
