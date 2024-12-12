import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const router = Router();

// Generar un nuevo usuario
router.post("/usuarioNuevo", async (req, res) => {
  const { nombre, apellido, direccion, email, contraseña } = req.body;
  console.log('Received user data:', { nombre, apellido, direccion, email });

  try {
    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Obtener el último id_usuario
    const ultimoUsuario = await Usuario.findOne({}, {}, { sort: { id_usuario: -1 } });
    const nuevoIdUsuario = ultimoUsuario ? ultimoUsuario.id_usuario + 1 : 1;

    // Hashear la contraseña
    const saltRounds = 8;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      id_usuario: nuevoIdUsuario,
      nombre,
      apellido,
      direccion,
      email,
      contraseña: hashedPassword
    });

    await nuevoUsuario.save();

    const token = jwt.sign(
      { id: nuevoUsuario.id_usuario, email: nuevoUsuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ 
      message: "Usuario creado con éxito", 
      token,
      usuario: {
        id_usuario: nuevoUsuario.id_usuario,
        nombre: nuevoUsuario.nombre,
        apellido: nuevoUsuario.apellido
      }
    });

  } catch (error) {
    console.error('Detalles completos del error:', error);
    res.status(500).json({ 
      message: "Error al crear usuario", 
      error: error.message,
      stack: error.stack 
    });
  }
});

// Validar Ingreso con Usuario y Contraseña
router.post("/login", async (req, res) => {
  const { email, contraseña } = req.body;

  try {
    // Buscar usuario por email
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // Validar contraseña
    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario.id_usuario, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        apellido: usuario.apellido
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Se produjo un error al intentar ingresar al sistema" });
  }
});

// Script para migrar datos de JSON a MongoDB (opcional)
const migrarUsuarios = async () => {
  try {
    const jsonData = await readFile("./data/usuarios.json", "utf-8");
    const usuarios = JSON.parse(jsonData);
    
    for (const usuario of usuarios) {
      await Usuario.findOneAndUpdate(
        { id_usuario: usuario.id_usuario },
        usuario,
        { upsert: true, new: true }
      );
    }
    
    console.log('Migración de usuarios completada con éxito');
  } catch (error) {
    console.error('Error en la migración de usuarios:', error);
  }
};

export default router;