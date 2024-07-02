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

// router.post("/login", async (req, res) => {
//   const email = req.body.email;
//   const pass = req.body.contraseña;
//   const dataUsuarios = await getData()

//   try {
//     const resultado = dataUsuarios.find(
//       (e) => e.email == email && e.contraseña == pass
//     );

//     if (resultado) {
//       res.status(200).json({
//         id_usuario: resultado.id_usuario,
//         nombre: resultado.nombre,
//         apellido: resultado.apellido
//       });
//     } else {
//       res.status(400).json({ message: "Credenciales incorrectas" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Se produjo un error al intentar ingresar al sistema" });
//   }
// });


export default router;

//Eliminar usuario

// router.delete("/delete/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const dataUsuarios = await getData()

//   try {
//     const i = dataUsuarios.findIndex((e) => e.id_usuario == id);

//     if (i >= 0) {
//       dataUsuarios.splice(i, 1);
//       writeFile("./data/usuarios.json", JSON.stringify(dataUsuarios, null, 2));
//       res.json({ message: "Usuario eliminado con éxito" });
//     } else {
//       res.status(200).json({ message: "No se encontró al usuario" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error al eliminar usuario" });
//   }
// });



// Actualizar domicilio cliente

// router.put("/actualizarDomicilio", async (req, res) => {
//   const { direccion, email } = req.body;
//   const dataUsuarios = await getData()

//   try {
//     const usuario = dataUsuarios.find((usuario) => usuario.email === email);
//     if (usuario) {
//       usuario.direccion = direccion;
//       await writeFile(
//         "./data/usuarios.json",
//         JSON.stringify(dataUsuarios, null, 2)
//       );

//       res.json({ message: "Domicilio actualizado con éxito" });
//     } else {
//       return res.status(404).json({ message: "No se encontró el usuario" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error al actualizar domicilio" });
//   }
// });

// Buscar Usuario por email

// router.get("/buscarPorEmail/:email", async (req, res) => {
//   const email = req.params.email;
//   const dataUsuarios = await getData()

//   try {
//     const usuario = dataUsuarios.find((user) => user.email === email);
//     if (!usuario) {
//       return res.status(400).json({ message: "Usuario no encontrado" });
//     } else {
//       return res.json(usuario);
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Error al buscar al usuario" });
//   }
// });

// Buscar Usuario por ID

// router.get("/buscarPorId/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const dataUsuarios = await getData()

//   try {
//     const usuario = dataUsuarios.find((e) => e.id_usuario == id);
//     if (!usuario) {
//       return res.status(400).json({ message: "Usuario no encontrado" });
//     } else {
//       return res.json(usuario);
//     }
//   } catch (error) {
//     return res.status(500).json({ message: "Error al buscar al usuario" });
//   }
// });

// // Mostrar todos los Usuario

// router.get("/all", async (req, res) => {
//   const dataUsuarios = await getData()

//   try {
//     res.status(200).json(dataUsuarios);
//   } catch (error) {
//     return res.status(500).json({ message: "Error al listar los usuario" });
//   }
// });
