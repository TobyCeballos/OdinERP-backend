import mongoose from "mongoose";
import productSchema from "../models/Product.js";
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
      console.log(`Producto creado - Nombre: ${product_name}, Marca: ${brand}`);
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
  console.log(product);
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
      console.log(results);
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
    console.log({ stock, purchase_price });
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
    console.log({ stock });
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


  console.log("Product deleteds");
};
