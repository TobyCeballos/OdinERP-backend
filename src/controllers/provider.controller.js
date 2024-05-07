import Provider from "../models/Provider.js";

export const createProvider = async (req, res) => {
    const highestProviderId = await Provider.findOne({}, { provider_id: 1 })
      .sort({ provider_id: -1 })
      .limit(1);
  
    // Obtener el nuevo ID autoincremental
    const newProviderId = highestProviderId
      ? highestProviderId.provider_id + 1
      : 1;
    console.log(req.params.providerName)
    const {
        email,
        phone,
        zip_code,
        address,
        cuit_cuil,
        vat_condition,
        credit_limit,
        last_purchase,
        notes,
        provider_state,
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
        const newProvider = new Provider({
            provider_id: newProviderId,
            provider_name: req.params.providerName || req.body.provider_name, // Tomar el nombre del cliente de req.params
            email: email || "",
            phone: phone || "",
            zip_code: zip_code || "",
            address: address || "",
            cuit_cuil:cuit_cuil || "",
            vat_condition: vat_condition || "final_consumer",
            credit_limit: credit_limit || 0,
            last_purchase: last_purchase || null,
            notes: notes || "",
            provider_state: provider_state || "active",
            admission_date: admissionDate
        });
  
        const providerSaved = await newProvider.save();
  
        res.status(201).json(providerSaved);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
  };
export const getProviderById = async (req, res) => {
  const providerId = req.params.providerId;
  try {
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    res.status(200).json(provider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el proveedor" });
  }
};

export const searchProviders = async (req, res) => {
  try {
    const query = req.params.data;
    if (query) {
      const results = await Provider.find({
        provider_name: { $regex: new RegExp(query, "i") },
      }).select({ __v: 0 }).limit(20);
      res.json(results);
    } else {
      const providers = await Provider.find().select("-_id");
      res.json(providers);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar proveedores" });
  }
};

export const getProviders = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const pageSize = 15;
    const skip = (page - 1) * pageSize;
    const providers = await Provider.find().sort({ admission_date: -1 }).skip(skip).limit(pageSize);
    res.json(providers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener proveedores" });
  }
};

export const updateProviderById = async (req, res) => {
  try {
    const updatedProvider = await Provider.findByIdAndUpdate(
      req.params.providerId,
      req.body,
      {
        new: true,
      }
    );
    res.status(204).json(updatedProvider);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el proveedor" });
  }
};

export const deleteProviderById = async (req, res) => {
  const { providerId } = req.params;
  try {
    await Provider.findByIdAndDelete(providerId);
    res.status(204).json();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el proveedor" });
  }
};

export const addToCurrentAccountCart = async (req, res) => {
  const providerId = req.params.providerId;
  const { cart } = req.body;
  try {
    const provider = await Provider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Proveedor no encontrado" });
    }
    cart.forEach((item) => {
      provider.current_account_cart.push({
        objectId: item.objectId,
        quantity: item.quantity
      });
    });
    await provider.save();
    res.status(200).json({ message: "Productos añadidos al carrito con éxito" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al añadir productos al carrito del proveedor" });
  }
};
