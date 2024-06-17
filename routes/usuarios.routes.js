import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const router = Router();

const fileUser = await readFile("./data/usuarios.json", "utf-8");
const usuarios = JSON.parse(fileUser);

// Buscar Usuario por email

router.get("/buscarPorEmail/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const usuario = usuarios.find((user) => user.email === email);
    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    } else {
      return res.json(usuario);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al buscar al usuario" });
  }
});

// Buscar Usuario por ID

router.get("/buscarPorId/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const usuario = usuarios.find((e) => e.id_usuario == id);
    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    } else {
      return res.json(usuario);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al buscar al usuario" });
  }
});

// Mostrar todos los Usuario

router.get("/all", async (req, res) => {
  try {
    res.status(200).json(usuarios);
  } catch (error) {
    return res.status(500).json({ message: "Error al listar los usuario" });
  }
});

// Actualizar domicilio cliente

router.put("/actualizarDomicilio", async (req, res) => {
  const { direccion, email } = req.body;

  try {
    const usuario = usuarios.find((usuario) => usuario.email === email);
    if (usuario) {
      usuario.direccion = direccion;
      await writeFile(
        "./data/usuarios.json",
        JSON.stringify(usuarios, null, 2)
      );

      res.json({ message: "Domicilio actualizado con éxito" });
    } else {
      return res.status(404).json({ message: "No se encontró el usuario" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar domicilio" });
  }
});

// Dar de alta Usuario

router.post("/usuarioNuevo", async (req, res) => {
  const { nombre, apellido, direccion, email, contraseña } = req.body;

  try {
    const nuevoUsuario = usuarios.find((e) => e.email === email);
    if (nuevoUsuario) {
      return res.status(400).json({ message: "El usuario ya existe" });
    } else {
      const id_usuario = usuarios.length + 1;
      const nuevoUsuario = {
        id_usuario,
        nombre,
        apellido,
        direccion,
        email,
        contraseña,
      };
      usuarios.push(nuevoUsuario);
      await writeFile(
        "./data/usuarios.json",
        JSON.stringify(usuarios, null, 2)
      );

      res.json({ message: "Usuario creado con éxito" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al crear usuario" });
  }
});

//Validar Ingreso con Usuario y Contraseña

router.post("/login", (req, res) => {
  const email = req.body.email;
  const pass = req.body.contraseña;

  try {
    const resultado = usuarios.find(
      (e) => e.email == email && e.contraseña == pass
    );

    if (resultado) {
      res
        .status(200)
        .json(`Bienvenido ${resultado.nombre} ${resultado.apellido}`);
    } else {
      res.status(400).json("Credenciales incorrectas");
    }
  } catch (error) {
    res.status(500).json({ message: "Se produjo un error al intentar ingresar al sistema" });
  }
});

//Eliminar usuario

router.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const i = usuarios.findIndex((e) => e.id_usuario == id);

    if (i >= 0) {
      usuarios.splice(i, 1);
      writeFile("./data/usuarios.json", JSON.stringify(usuarios, null, 2));
      res.json({ message: "Usuario eliminado con éxito" });
    } else {
      res.status(200).json({ message: "No se encontró al usuario" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});


export default router;
