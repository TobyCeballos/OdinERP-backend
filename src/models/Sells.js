import { ObjectId } from "mongodb";
import mongoose from "mongoose";

const sellSchema = new mongoose.Schema({
    sale_id: {
      type: Number
    },
    cashRegister: {
      type: String,
    },
    customer: {
      type: String,
    },
    description: {
      type: String,
    },
    shippingAddress: {
      type: String
    },
    warranty: {
      type: String
    },
    receiptType: {
      type: String,
      required: true
    },
    payCondition: {
      type: String,
      required: true
    },
    vatCondition: {
      type: String,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    deposit: {
      type: Number,
      default: 0
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    cart: [{
      objectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }]
  }, {
    timestamps: true
  }
);


export default sellSchema