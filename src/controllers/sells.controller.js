import sellSchema from "../models/Sells.js";
import mongoose from "mongoose";

export const createSell = async (req, res) => {
  const collectionName = req.params.company + "-sells";

  const Sells = mongoose.model("Sells", sellSchema, collectionName);

  const highestSaleId = await Sells.findOne({}, { sale_id: 1 })
  .sort({ sale_id: -1 })
  .limit(1);

// Obtener el nuevo ID autoincremental
const newSaleId = highestSaleId ? highestSaleId.sale_id + 1 : 1;
  const {
    cashRegister,
    customer,
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
    const newSell = new Sells({
      sale_id: newSaleId,
      cashRegister,
      customer: customer || "Cliente",
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

    const sellSaved = await newSell.save();

    res.status(201).json(sellSaved);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
};

export const getSellById = async (req, res) => {
  const collectionName = req.params.company + "-sells";

  const Sells = mongoose.model("Sells", sellSchema, collectionName);

  const sellId = req.params.sellId;

  const sell = await Sells.findById(sellId);
  
  res.status(200).json(sell);
};

export const searchSells = async (req, res) => {
  const page = req.query.page || 1;
  const pageSize = 15;
  const skip = (page - 1) * pageSize;
  try {
    const query = req.params.data;

    if (query) {
      const results = await Sells.find({
        $or: [
          { cashRegister: { $regex: new RegExp(query, "i") } },
          { customer: { $regex: new RegExp(query, "i") } },
          // Agrega más campos aquí si deseas buscar en otros campos de tu modelo de Sell
        ],
      }).select({ _id: 0, __v: 0 }).skip(skip).limit(pageSize);

      res.json(results);
    } else {
      const sells = await Sells.find().select("-_id");
      res.json(sells);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar ventas" });
  }
};
export const getSells = async (req, res) => {
  const collectionName = req.params.company + "-sells";

  const Sells = mongoose.model("Sells", sellSchema, collectionName);

  try {
    const page = req.query.page || 1;
    const pageSize = 15;
    const skip = (page - 1) * pageSize;
    const sells = await Sells.find().sort({ updatedAt: -1 }).skip(skip).limit(pageSize);
    return res.json(sells);
  } catch (error) {
    return res.status(500).json({ message: "Error al obtener ventas", error: error });
  }
};
export const updateSellById = async (req, res) => {
  const collectionName = req.params.company + "-sells";

  const Sells = mongoose.model("Sells", sellSchema, collectionName);

  req.body.modification_date = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const updatedSell = await Sells.findByIdAndUpdate(
    req.params.sellId,
    req.body,
    {
      new: true,
    }
  );

  res.status(204).json(updatedSell);
};

export const payOffSell = async (req, res) => {
  const collectionName = req.params.company + "-sells";

  const Sells = mongoose.model("Sells", sellSchema, collectionName);

  try {
    // Obtener el ID de la venta de la solicitud
    const sellId = req.params.sellId;

    // Buscar la venta por su ID
    const sell = await Sells.findById(sellId);

    // Verificar si la venta existe
    if (!sell) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    // Verificar si la venta ya está saldada
    if (sell.payCondition !== 'current_account') {
      return res.status(400).json({ message: 'La venta no está asociada a una cuenta corriente' });
    }

    // Actualizar el campo payCondition a 'cash' (efectivo)
    sell.payCondition = 'cash';

    // Guardar los cambios
    await sell.save();

    // Respuesta exitosa
    res.status(200).json({ message: 'Venta saldada exitosamente' });
  } catch (error) {
    console.error('Error al saldar la venta:', error);
    res.status(500).json({ message: 'Error al saldar la venta' });
  }
};

export const deleteSellById = async (req, res) => {
  const collectionName = req.params.company + "-sells";

  const Sells = mongoose.model("Sells", sellSchema, collectionName);

  const { sellId } = req.params;

  await Sells.findByIdAndDelete(sellId);

  res.status(204).json();
};
