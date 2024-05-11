import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
    purchase_id: {
      type: Number
    },
    provider: {
      type: String,
      required: true
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
    products: [{
      productId: {
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

export default purchaseSchema;
