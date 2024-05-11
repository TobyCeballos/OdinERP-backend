import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    product_id: { type: Number, unique: true },
    product_name: { type: String, required: true },
    product_provider: { type: String, required: true },
    provider_product_id: String,
    description: String,
    category: String,
    brand: String,
    purchase_price: { type: Number, required: true },
    current_price: { type: String, required: true },
    sale_price: { type: String, required: true },
    unit_measurement: String,
    stock:  { type: Number, required: true },
    min_stock: Number,
    max_stock:Number,
    product_state: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps:true
  }
);

export default productSchema
