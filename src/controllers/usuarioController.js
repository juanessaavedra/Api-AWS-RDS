const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('./../models/usuario');

// Función para crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Usuario.createUser(username, email, hashedPassword);
    res.status(201).json({ user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Función para iniciar sesión
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Función para cerrar sesión
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Sesión cerrada correctamente' });
};

// Función para obtener el perfil de usuario
exports.getProfile = async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.id);
    res.json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};