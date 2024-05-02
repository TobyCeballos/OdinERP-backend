import Customer from "../models/Customer.js";

export const createCustomer = async (req, res) => {
  const highestCustomerId = await Customer.findOne({}, { customer_id: 1 })
    .sort({ customer_id: -1 })
    .limit(1);

  // Obtener el nuevo ID autoincremental
  const newCustomerId = highestCustomerId
    ? highestCustomerId.customer_id + 1
    : 1;
  console.log(req.params.customerName)
  const {
      email,
      phone,
      zip_code,
      shipping_address,
      cuit_cuil,
      vat_condition,
      credit_limit,
      last_purchase,
      notes,
      customer_state,
  } = req.body;
  const admissionDate = new Date().toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

  try {
      const newCustomer = new Customer({
          customer_id: newCustomerId,
          customer_name: req.params.customerName || req.body.customer_name, // Tomar el nombre del cliente de req.params
          email: email || "",
          phone: phone || "",
          zip_code: zip_code || "",
          shipping_address: shipping_address || "",
          cuit_cuil:cuit_cuil || "",
          vat_condition: vat_condition || "final_consumer",
          credit_limit: credit_limit || 0,
          last_purchase: last_purchase || null,
          notes: notes || "",
          customer_state: customer_state || "active",
          current_account_cart: [],
          admission_date: admissionDate
      });

      const customerSaved = await newCustomer.save();

      res.status(201).json(customerSaved);
  } catch (error) {
      console.error(error);
      return res.status(500).json(error);
  }
};


export const getCustomerById = async (req, res) => {
  const customerId = req.params.customerId;

  try {
    const customer = await Customer.findById(customerId);
    res.status(200).json(customer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el cliente" });
  }
};

export const searchCustomers = async (req, res) => {
  try {
    const query = req.params.data;
    if (query) {
      const results = await Customer.find({
        customer_name: { $regex: new RegExp(query, "i") },
      }).select({ __v: 0 });
      res.json(results);
    } else {
      const customers = await Customer.find().select("-_id");
      res.json(customers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar clientes" });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ admission_date: -1 });
    res.json(customers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener clientes" });
  }
};

export const updateCustomerById = async (req, res) => {
  req.body.modification_date = new Date().toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.customerId,
      req.body,
      {
        new: true,
      }
    );
    res.status(204).json(updatedCustomer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el cliente" });
  }
};

export const deleteCustomerById = async (req, res) => {
  const { customerId } = req.params;

  try {
    await Customer.findByIdAndDelete(customerId);
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el cliente" });
  }
};export const addToCurrentAccountCart = async (req, res) => {
  const customerId = req.params.customerId;
  const { cart } = req.body;

  try {
    // Encuentra al cliente por su ID
    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    // Agrega los productos del carrito al carrito de la cuenta actual del cliente
    cart.forEach((item) => {
      customer.current_account_cart.push({
        objectId: item.objectId,
        quantity: item.quantity
      });
    });

    // Guarda el cliente actualizado en la base de datos
    await customer.save();

    res.status(200).json({ message: "Productos añadidos al carrito con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al añadir productos al carrito del cliente" });
  }
};