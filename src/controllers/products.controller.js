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
    const existingProduct = await Product.findOne({
      product_name: product_name,
    });

    if (existingProduct) {
      // Si el producto ya existe, actualiza solo el campo current_price
      existingProduct.current_price = current_price;
      existingProduct.modification_date = modificationDate;
      const productSaved = await existingProduct.save();
      const message =`Producto actualizado - Nombre: ${product_name}, Marca: ${brand}, Nuevo precio: ${current_price}`;
      res.status(200).json({prod:productSaved, message:message});
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
    return res.status(500).json({ message: "Error al crear o actualizar el producto", error: error });
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
      }).select({ __v: 0 }).limit(15);
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
  try {
    const page = req.query.page || 1;
    const pageSize = 15;
    const skip = (page - 1) * pageSize;
    const products = await Product.find().skip(skip).limit(pageSize)
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