import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  customer_id: { type: Number },
  customer_name: { type: String, required: true, unique:true },
  email: { type: String },
  phone: { type: String },
  zip_code: { type: String },
  shipping_address: { type: String },
  cuit_cuil: { type: String },
  vat_condition: { type: String },
  credit_limit: { type: Number },
  pending_balance: { type: Number },
  admission_date: { type: String },
  notes: { type: String },
  customer_state: { type: String },
  current_account_cart: []},
  {
    timestamps: true
  } // Asumiendo que 'Product' es el nombre del modelo de los productos
);


export default mongoose.model("Customer", customerSchema);