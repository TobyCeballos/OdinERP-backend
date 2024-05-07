import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  provider_id: { type: Number },
  provider_name: { type: String, required: true, unique: true },
  email: { type: String },
  phone: { type: String },
  zip_code: { type: String },
  address: { type: String },
  cuit_cuil: { type: String },
  vat_condition: { type: String },
  credit_limit: { type: Number },
  pending_balance: { type: Number },
  admission_date: { type: String },
  notes: { type: String },
  provider_state: { type: String },
}, {
  timestamps: true
});

export default mongoose.model("Provider", providerSchema);
