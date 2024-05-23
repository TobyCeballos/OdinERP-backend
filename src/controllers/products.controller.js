import mongoose from "mongoose";
import productSchema from "../models/Product.js";
import { io } from "../../index.js"; // Importa io desde app.js
import XLSX from 'xlsx';

export const createProduct = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Product = mongoose.model("Product", productSchema, collectionName);

  const highestProductId = await Product.findOne({}, { product_id: 1 })
    .sort({ product_id: -1 })
    .limit(1);

  // Obtener el nuevo ID autoincremental
  const newProductId = highestProductId ? highestProductId.product_id + 1 : 1;
  const {
    product_name,
    product_provider,
    purchase_price,
    current_price,
    sale_price,
    category,
    brand,
    description,
    provider_product_id,
    unit_measurement,
    stock,
    min_stock,
    max_stock,
    product_state,
  } = req.body;
  const modificationDate = new Date().toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  try {
    const existingProduct = await Product.findOne({
      product_name: product_name,
    });

    if (existingProduct) {
      // Si el producto ya existe, actualiza solo el campo current_price
      existingProduct.sale_price = sale_price || 30;
      existingProduct.current_price = current_price;
      existingProduct.modification_date = modificationDate;
      const productSaved = await existingProduct.save();
      const message = `Producto actualizado - Nombre: ${product_name}, Marca: ${brand}, Nuevo precio: ${current_price}`;
      res.status(200).json({ prod: productSaved, message: message });
    } else {
      // Si el producto no existe, créalo
      const newProduct = new Product({
        product_id: newProductId,
        product_name: product_name || "prod",
        product_provider: product_provider || "prov",
        purchase_price: purchase_price || 0,
        current_price: current_price || 0,
        sale_price: sale_price || 30,
        category: category || "cat",
        brand: brand || "brand",
        description: description || "desc",
        provider_product_id: provider_product_id || "provID",
        unit_measurement: unit_measurement || "unidad",
        stock: stock || 0,
        min_stock: min_stock || 0,
        max_stock: max_stock || 0,
        modification_date: modificationDate,
        product_state: product_state || "active",
      });
      const productSaved = await newProduct.save();
      res.status(201).json(productSaved);
    }
  } catch (error) {
    console.error("Error al crear o actualizar el producto:", error);
    return res
      .status(500)
      .json({
        message: "Error al crear o actualizar el producto",
        error: error,
      });
  }
};

export const getProductById = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Product = mongoose.model("Product", productSchema, collectionName);

  const productId = req.params.productId;

  const product = await Product.findById(productId);
  res.status(200).json(product);
};
export const searchProducts = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Product = mongoose.model("Product", productSchema, collectionName);

  try {
    const query = await req.params.data;
    if (query) {
      const results = await Product.find({
        $or: [
          { product_name: { $regex: new RegExp(query, "i") } },
          { brand: { $regex: new RegExp(query, "i") } },
          { provider_product_id: { $regex: new RegExp(query, "i") } },
        ],
      })
        .select({ __v: 0 })
        .limit(15);
      res.json(results);
    } else {
      try {
        const products = await Product.find();
        return res.json(products);
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Error al obtener productos", error: error });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar productos" });
  }
};
export const getProducts = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Product = mongoose.model("Product", productSchema, collectionName);
  //await deleteProducts(collectionName)
  try {
    const page = req.query.page || 1;
    const pageSize = 20;
    const skip = (page - 1) * pageSize;
    const products = await Product.find().skip(skip).limit(pageSize);
    return res.json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener productos", error: error });
  }
};
export const updateProductByIdOnBuy = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Product = mongoose.model("Product", productSchema, collectionName);

  const { productId } = req.params;
  const { stock, purchase_price } = req.body;

  try {
    // Buscar el producto por su ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    // Sumar la cantidad enviada desde el frontend al stock actual del producto
    product.stock += stock;
    product.purchase_price = purchase_price;

    // Guardar los cambios en la base de datos
    const updatedProduct = await product.save();

    // Devolver el producto actualizado como respuesta
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al actualizar el producto" });
  }
};
export const updateProductByIdOnSell = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Product = mongoose.model("Product", productSchema, collectionName);

  const { productId } = req.params;
  const { stock } = req.body;

  try {
    // Buscar el producto por su ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    // Sumar la cantidad enviada desde el frontend al stock actual del producto
    product.stock -= stock;

    // Guardar los cambios en la base de datos
    const updatedProduct = await product.save();

    // Devolver el producto actualizado como respuesta
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al actualizar el producto" });
  }
};

export const deleteProductById = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Product = mongoose.model("Product", productSchema, collectionName);

  const { productId } = req.params;

  await Product.findByIdAndDelete(productId);

  res.status(204).json();
};

export const updateProductById = async (req, res) => {
  const collectionName = req.params.company + "-products";

  const Product = mongoose.model("Product", productSchema, collectionName);

  const { productId } = req.params;
  const updateFields = req.body;

  try {
    // Buscar el producto por su ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar los campos del producto
    Object.keys(updateFields).forEach((key) => {
      product[key] = updateFields[key];
    });

    // Guardar los cambios en la base de datos
    const updatedProduct = await product.save();

    // Devolver el producto actualizado como respuesta
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res
      .status(500)
      .json({ message: "Error del servidor al actualizar el producto" });
  }
};

const deleteProducts = async({ collectionName }) => {
  const Product = mongoose.model("Product", productSchema, collectionName);


await Product.deleteMany({
  
product_id: {
    $gte: 13185,
    $lte: 14441
  }
}).then(result => {
  console.log(result.deletedCount + " documentos eliminados");
}).catch(err => {
  console.error(err);
});


  console.log("Product deleted");
};
export const bulkUpdateProducts = async (req, res) => {
  const collectionName = req.params.company + "-products";
  const Product = mongoose.model('Product', productSchema, collectionName);

  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: 'No se ha subido ningún archivo' });
  }

  const file = req.files.file;
  const salePrice = req.body.sale_price;
  const productProvider = req.body.product_provider;
  
  const vatValue = parseFloat(req.body.vat_value) || 0;
  const discount = parseFloat(req.body.discount) || 0;
  console.log("descuento: " + req.body.discount)
  console.log("iva: " + req.body.vat_value)
  try {
    const workbook = XLSX.read(file.data, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const existingProducts = await Product.find({ product_name: { $in: jsonData.map(product => product.product_name.toLowerCase()) } });

    const existingProductsDict = existingProducts.reduce((dict, product) => {
      dict[product.product_name.toLowerCase()] = product;
      return dict;
    }, {});

    const highestProduct = await Product.findOne({}, { product_id: 1 }).sort({ product_id: -1 }).limit(1);
    let newProductId = highestProduct ? highestProduct.product_id + 1 : 1;

    const bulkOperations = jsonData.map((product, index) => {
      const existingProduct = existingProductsDict[product.product_name.toLowerCase()];
      const productIdToUse = existingProduct ? existingProduct.product_id : newProductId++;

      // Emitir progreso cada 10 productos
      if (index % 10 === 0) {
        const progress = Math.round((index / jsonData.length) * 100);
        io.emit('progress', { progress });
      }

      // Calcular el precio actual con el IVA y el descuento
      const currentPrice = parseFloat(product.current_price) || 0;
      const currentPriceWithVAT = currentPrice * (1 + vatValue / 100);
      const finalSalePrice = currentPriceWithVAT * (1 - discount / 100);

      return {
        updateOne: {
          filter: { product_name: product.product_name.toLowerCase() },
          update: {
            $set: {
              product_id: productIdToUse,
              provider_product_id: product.provider_product_id,
              current_price: finalSalePrice,
              sale_price: salePrice || 0,
              product_provider: productProvider || "prov",
              purchase_price: product.purchase_price || 0,
              category: product.category || "cat",
              brand: product.brand || "brand",
              description: product.description || "desc",
              unit_measurement: product.unit_measurement || "unidad",
              stock: product.stock || 0,
              min_stock: product.min_stock || 0,
              max_stock: product.max_stock || 0,
              product_state: product.product_state || "active",
            },
          },
          upsert: true,
        },
      };
    });

    const result = await Product.bulkWrite(bulkOperations);
    res.status(200).json({
      message: `Operación completada. Productos actualizados: ${result.modifiedCount}. Productos insertados: ${result.upsertedCount}.`,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al realizar la actualización masiva',
      error: error.message,
    });
  }
};