
import purchaseSchema from "../models/Purchases.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
export const createPurchase = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Purchase = mongoose.model("Purchase", purchaseSchema, collectionName);

  const highestPurchaseId = await Purchase.findOne({}, { purchase_id: 1 })
    .sort({ purchase_id: -1 })
    .limit(1);

  // Obtener el nuevo ID autoincremental
  const newPurchaseId = highestPurchaseId ? highestPurchaseId.purchase_id + 1 : 1;

  const {
    cashRegister,
    provider,
    description,
    zipCode,
    warranty,
    receiptType,
    payCondition,
    vatCondition,
    discount,
    deposit,
    cart,
  } = req.body;

  const modificationDate = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  try {
    // Crear la compra
    const newPurchase = new Purchase({
      purchase_id: newPurchaseId,
      cashRegister,
      provider,
      description,
      zipCode,
      warranty,
      receiptType,
      payCondition,
      vatCondition,
      discount,
      deposit,
      upload_date: new Date(),
      modification_date: modificationDate,
    });

    // Guardar la compra en la base de datos
    const purchaseSaved = await newPurchase.save();

    // Aumentar el stock de los productos del carrito
    for (const item of cart) {
      const product = await Product.findById(item.product_id);
      if (!product) {
        console.log(`Producto con ID ${item.product_id} no encontrado.`);
        continue;
      }
      // Aumentar el stock del producto
      product.stock += item.quantity;
      await product.save();
    }

    // Devolver la respuesta
    res.status(201).json(purchaseSaved);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getPurchaseById = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Purchase = mongoose.model("Purchase", purchaseSchema, collectionName);

  const purchaseId = req.params.purchaseId;

  const purchase = await Purchase.findById(purchaseId);
  
  res.status(200).json(purchase);
};

export const searchPurchases = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Purchase = mongoose.model("Purchase", purchaseSchema, collectionName);

  const page = req.query.page || 1;
  const pageSize = 15;
  const skip = (page - 1) * pageSize;
  try {
    const query = req.params.data;

    if (query) {
      const results = await Purchase.find({
        $or: [
          { cashRegister: { $regex: new RegExp(query, "i") } },
          { provider: { $regex: new RegExp(query, "i") } },
          // Agrega más campos aquí si deseas buscar en otros campos de tu modelo de Purchase
        ],
      }).select({ _id: 0, __v: 0 }).skip(skip).limit(pageSize);

      res.json(results);
    } else {
      const purchases = await Purchase.find().select("-_id");
      res.json(purchases);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar compras" });
  }
};

export const getPurchases = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Purchase = mongoose.model("Purchase", purchaseSchema, collectionName);

  try {
    const page = req.query.page || 1;
    const pageSize = 15;
    const skip = (page - 1) * pageSize;
    const purchases = await Purchase.find().sort({ updatedAt: -1 }).skip(skip).limit(pageSize);
    return res.json(purchases);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener compras", error: error });
  }
};

export const updatePurchaseById = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Purchase = mongoose.model("Purchase", purchaseSchema, collectionName);

  req.body.modification_date = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const updatedPurchase = await Purchase.findByIdAndUpdate(
    req.params.purchaseId,
    req.body,
    {
      new: true,
    }
  );

  res.status(204).json(updatedPurchase);
};

export const payOffPurchase = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Purchase = mongoose.model("Purchase", purchaseSchema, collectionName);

  try {
    // Obtener el ID de la compra de la solicitud
    const purchaseId = req.params.purchaseId;

    // Buscar la compra por su ID
    const purchase = await Purchase.findById(purchaseId);

    // Verificar si la compra existe
    if (!purchase) {
      return res.status(404).json({ message: 'Compra no encontrada' });
    }

    // Verificar si la compra ya está saldada
    if (purchase.payCondition !== 'current_account') {
      return res.status(400).json({ message: 'La compra no está asociada a una cuenta corriente' });
    }

    // Actualizar el campo payCondition a 'cash' (efectivo)
    purchase.payCondition = 'cash';

    // Guardar los cambios
    await purchase.save();

    // Respuesta exitosa
    res.status(200).json({ message: 'Compra saldada exitosamente' });
  } catch (error) {
    console.error('Error al saldar la compra:', error);
    res.status(500).json({ message: 'Error al saldar la compra' });
  }
};

export const deletePurchaseById = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Purchase = mongoose.model("Purchase", purchaseSchema, collectionName);

  const { purchaseId } = req.params;

  await Purchase.findByIdAndDelete(purchaseId);

  res.status(204).json();
};
