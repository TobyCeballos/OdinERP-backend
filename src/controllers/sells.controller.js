import sellSchema from "../models/Sells.js";
import customerSchema from "../models/Customer.js";
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
  const collectionName = req.params.company + '-sells';
  const customerCollectionName = req.params.company + '-customers';

  const Sells = mongoose.model('Sells', sellSchema, collectionName);
  const Customers = mongoose.model('Customers', customerSchema, customerCollectionName);

  try {
    // Obtener el ID de la venta de la solicitud
    const sellId = req.params.sellId;
    console.log(`Searching for sell with ID: ${sellId} in collection: ${collectionName}`);

    // Buscar la venta por su ID
    const sell = await Sells.findById(sellId);
    console.log(`Sell found: ${sell}`);

    // Verificar si la venta existe
    if (!sell) {
      console.log('Venta no encontrada');
      return res.status(404).json({ message: 'Venta no encontrada' });
    }

    // Verificar si la venta ya está saldada
    if (sell.payCondition !== 'current_account') {
      console.log('La venta no está asociada a una cuenta corriente');
      return res.status(400).json({ message: 'La venta no está asociada a una cuenta corriente' });
    }

    // Obtener el cliente asociado a la venta
    const customerName = sell.customer; // Asegúrate de que sell tiene una propiedad customer
    console.log(`Searching for customer with name: ${customerName} in collection: ${customerCollectionName}`);
    const customer = await Customers.findOne({ customer_name: customerName });
    console.log(`Customer found: ${customer}`);

    if (!customer) {
      console.log('Cliente no encontrado');
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    // Verificar que el carrito de la cuenta actual exista
    if (!customer.current_account_cart) {
      console.log('El carrito de la cuenta actual no existe');
      return res.status(400).json({ message: 'El carrito de la cuenta actual no existe' });
    }

    // Obtener el carrito de la venta
    const sellCart = sell.cart; // Asegúrate de que sell tiene una propiedad cart
    console.log(`Sell cart: ${JSON.stringify(sellCart)}`);

    // Actualizar el current_account_cart del cliente eliminando o ajustando las cantidades de los productos pagados
    customer.current_account_cart = customer.current_account_cart.reduce((updatedCart, item) => {
      const sellItem = sellCart.find(sellItem => sellItem.objectId && item.objectId &&
        sellItem.objectId.toString() === item.objectId.toString());

      if (sellItem) {
        const newQuantity = item.quantity - sellItem.quantity;
        if (newQuantity > 0) {
          updatedCart.push({ ...item, quantity: newQuantity });
        }
        // Si la cantidad nueva es 0, no se agrega al carrito actualizado, lo que equivale a eliminar el producto
      } else {
        updatedCart.push(item);
      }

      return updatedCart;
    }, []);

    console.log(`Updated current account cart: ${JSON.stringify(customer.current_account_cart)}`);

    // Guardar los cambios en el cliente
    await customer.save();

    // Actualizar el campo payCondition a 'cash' (efectivo)
    sell.payCondition = 'cash';

    // Guardar los cambios en la venta
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
