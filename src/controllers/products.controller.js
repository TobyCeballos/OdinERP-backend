import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
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
const modificationDate = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  try {
    const newProduct = new Product({
      product_id: newProductId,
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
      upload_date: "18/03/2024", // convertimos a formato fecha
      modification_date: modificationDate, // convertimos a formato fecha
      product_state,
    });
    console.log(newProduct);
    const productSaved = await newProduct.save();

    res.status(201).json(productSaved);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getProductById = async (req, res) => {
  const productId = req.params.productId;

  const product = await Product.findById(productId);
  console.log(product);
  res.status(200).json(product);
};
export const searchProducts = async (req, res) => {
  try {
    const query = await req.params.data;
    if (query) {
      const results = await Product.find({
        $or: [
          { product_name: { $regex: new RegExp(query, "i") } }, // Buscar por fragmentos de texto en el nombre del producto
          { brand: { $regex: new RegExp(query, "i") } }, // Buscar por fragmentos de texto en la descripción del producto (si es aplicable)
          // Agrega más campos aquí si deseas buscar en otros campos de tu modelo de Producto
        ],
      }).select({ _id: 0, __v: 0 });
      console.log(results);
      res.json(results);
    } else {
      try {
        const products = await Product.find().select("-_id");
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
  try {
    const products = await Product.find()
    return res.json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al obtener productos", error: error });
  }
};

export const updateProductById = async (req, res) => {
  
  req.body.modification_date = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.productId,
    req.body,
    {
      new: true,
    }
  );
  res.status(204).json(updatedProduct);
};

export const deleteProductById = async (req, res) => {
  const { productId } = req.params;

  await Product.findByIdAndDelete(productId);

  res.status(204).json();
};
