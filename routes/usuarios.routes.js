import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const router = Router();

const getData = async () => {
  const fileUser = await readFile("./data/usuarios.json", "utf-8");
  return JSON.parse(fileUser);
}

//Generar un nuevo usuario

router.post("/usuarioNuevo", async (req, res) => {
  const { nombre, apellido, direccion, email, contraseña } = req.body;
  const dataUsuarios = await getData()

  try {
    const usuarioExistente = dataUsuarios.find((e) => e.email === email);
    if (usuarioExistente) {
      return res.status(400).json({ message: "El usuario ya existe" });
    } else {
      const id_usuario = dataUsuarios.length + 1;
      
      
      const saltRounds = 8;
      const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

      const nuevoUsuario = {
        id_usuario,
        nombre,
        apellido,
        direccion,
        email,
        contraseña: hashedPassword, 
      };
      dataUsuarios.push(nuevoUsuario);
      await writeFile(
        "./data/usuarios.json",
        JSON.stringify(dataUsuarios, null, 2)
      );

      const token = jwt.sign(
        { id: nuevoUsuario.id_usuario, email: nuevoUsuario.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      res.json({ message: "Usuario creado con éxito", token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear usuario" });
  }
});

//Validar Ingreso con Usuario y Contraseña

router.post("/login", async (req, res) => {
  const { email, contraseña } = req.body;
  const dataUsuarios = await getData()

  try {
    const usuario = dataUsuarios.find(e => e.email === email);

    if (!usuario) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!contraseñaValida) {
      return res.status(400).json({ message: "Credenciales incorrectas" });
    }

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


export default router;


