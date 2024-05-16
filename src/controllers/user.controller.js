import User from "../models/User.js";
import Role from "../models/Role.js";

export const createUser = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    const rolesFound = await Role.find({ name: { $in: roles } });

    // creating a new User
    const user = new User({
      username,
      email,
      password,
      roles: rolesFound.map((role) => role._id),
    });

    // encrypting password
    user.password = await User.encryptPassword(user.password);

    // saving the new user
    const savedUser = await user.save();

    return res.status(200).json({
      _id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      roles: savedUser.roles,
    });
  } catch (error) {
    console.error(error);
  }
};
export const getUsers = async (req, res) => {
  try {
    const companyValue = req.params.company;
    const users = await User.find({ company: companyValue }).sort({ updatedAt: -1, user_state: -1 });
    return res.json(users);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};



export const getUser = async (req, res) => {
  const user = await User.findById(req.params.userId);
  return res.json(user);
};

export const toggleUserState = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Buscar el usuario por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Cambiar el estado del usuario
    user.user_state = user.user_state === "active" ? "inactive" : "active";

    // Guardar los cambios en la base de datos
    const updatedUser = await user.save();

    // Devolver el usuario actualizado como respuesta
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al cambiar el estado del usuario:", error);
    return res.status(500).json({ message: "Error del servidor al cambiar el estado del usuario" });
  }
};
