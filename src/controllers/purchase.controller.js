import Purchase from "../models/Purchases.js";

export const createPurchase = async (req, res) => {
  const highestPurchaseId = await Purchase.findOne({}, { purchase_id: 1 })
    .sort({ purchase_id: -1 })
    .limit(1);

  // Obtener el nuevo ID autoincremental
  const newPurchaseId = highestPurchaseId ? highestPurchaseId.purchase_id + 1 : 1;

  const {
    cashRegister,
    provider,
    description,
    shippingAddress,
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
    const newPurchase = new Purchase({
      purchase_id: newPurchaseId,
      cashRegister,
      provider,
      description,
      shippingAddress,
      warranty,
      receiptType,
      payCondition,
      vatCondition,
      discount,
      deposit,
      cart,
      upload_date: new Date(),
      modification_date: modificationDate,
    });

    const purchaseSaved = await newPurchase.save();

    res.status(201).json(purchaseSaved);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getPurchaseById = async (req, res) => {
  const purchaseId = req.params.purchaseId;

  const purchase = await Purchase.findById(purchaseId);
  
  res.status(200).json(purchase);
};

export const searchPurchases = async (req, res) => {
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
  const { purchaseId } = req.params;

  await Purchase.findByIdAndDelete(purchaseId);

  res.status(204).json();
};
