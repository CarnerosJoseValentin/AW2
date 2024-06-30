import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

const router = Router();

const getData = async()=>{
  const fileUser = await readFile("./data/productos.json", "utf-8");
  return JSON.parse(fileUser);
}

// Mostrar todos los Productos.

router.get("/all", async (req, res) => {
  const dataProductos = await getData()
  try {
    res.status(200).json(dataProductos);
  } catch {
    res
      .send(500)
      .json({ message: "Se produjo un error al listar los productos." });
  }
});

// Listar producto por Id

router.get("/buscarProductoPorId/:id", async (req, res) => {
  const id_producto = parseInt(req.params.id);
  const dataProductos = await getData()

  try {
    const producto = dataProductos.find((e) => e.id_producto == id_producto);
    if (!producto) {
      return res.status(400).json({ message: "Producto no encontrado" });
    } else {
      return res.json(producto);
    }
  } catch (error) {
    return res.status(500).json({ message: "Error al buscar el producto" });
  }
});
export default router;

// // Buscar Producto por palabra clave.

// router.get("/buscarArtPorPalabra/:palabra", async (req, res) => {
//   const palabra = req.params.palabra.toLocaleLowerCase();
//   const dataProductos = await getData()

//   try {
//     const producto = dataProductos.filter((product) =>
//       product.nombre.toLocaleLowerCase().includes(palabra)
//     );
//     if (producto.length === 0) {
//       return res.status(400).json({
//         message: "No se encontraron productos con la palabra elegida",
//       });
//     } else {
//       return res.json(producto);
//     }
//   } catch (error) {
//     res
//       .send(500)
//       .json({ message: "Se produjo un error inesperado en la busqueda." });
//   }
// });



// // Buscar Producto por rango de precios

// router.post("/BuscarPorPrecio", async (req, res) => {
//   const desde = req.body.desde;
//   const hasta = req.body.hasta;
//   const dataProductos = await getData()
//   try {
//     const arr = dataProductos.filter((e) => e.precio >= desde && e.precio <= hasta);

//     const resultado = arr.map((e) => {
//       return {
//         id_producto: e.id_producto,
//         categoria: e.categoria,
//         nombre: e.nombre,
//         desc: e.desc,
//         precio: e.precio,
//         imagen: e.imagen,
//       };
//     });
//     if (resultado) {
//       res.status(200).json(resultado);
//     } else {
//       res
//         .status(400)
//         .json(
//           `No se encontraron productos entre los montos ${desde} y ${hasta}`
//         );
//     }
//   } catch (error) {
//     res.send(500).json("Se produjo un error inesperado en la busqueda.");
//   }
// });

// // Dar de alta Producto

// router.post("/ProductoNuevo", async (req, res) => {
//   const { nombre, desc, precio, imagen } = req.body;
//   const dataProductos = await getData()
//   try {
//     const nuevoProducto = dataProductos.find((e) => e.nombre === nombre);
//     if (nuevoProducto) {
//       return res.status(400).json({ message: "El producto ya existe" });
//     } else {
//       const id_producto = dataProductos.length + 1;
//       const nuevoProducto = { id_producto, categoria, nombre, desc, precio, imagen };
//       dataProductos.push(nuevoProducto);
//       await writeFile(
//         "./data/productos.json",
//         JSON.stringify(dataProductos, null, 2)
//       );

//       res.json({ message: "Producto cargado con éxito" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error al cargar el producto" });
//   }
// });

// // Actualizar Precio del producto

// router.put("/actualizarPrecio", async (req, res) => {
//   const id_producto = parseInt(req.body.id_producto);
//   const precio = parseFloat(req.body.precio);
//   const dataProductos = await getData()

//   try {
//     const producto = dataProductos.find(
//       (producto) => producto.id_producto == id_producto
//     );
//     if (producto) {
//       producto.precio = precio;
//       await writeFile("./data/productos.json", JSON.stringify(dataProductos, null, 2));

//       res.json({ message: "Precio del producto actualizado con éxito" });
//     } else {
//       return res.status(404).json({ message: "No se encontró el producto" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error al actualizar el precio del producto" });
//   }
// });

// // Aumentar Precios de los productos

// router.put("/aumentarPrecios", async (req, res) => {
//   const porcentaje = parseFloat(req.body.porcentaje);
//   const dataProductos = await getData()

//   try {
//     dataProductos.forEach((producto) => {
//       producto.precio += (producto.precio * porcentaje) / 100;
//     });

//     await writeFile(
//       "./data/productos.json",
//       JSON.stringify(dataProductos, null, 2)
//     );

//     res.json({ message: "Precios de los productos actualizados con éxito" });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error al actualizar los precios de los productos",
//       error: error.message,
//     });
//   }
// });

// // Disminuir Precios de los productos

// router.put("/disminuirPrecios", async (req, res) => {
//   const porcentaje = parseFloat(req.body.porcentaje);
//   const dataProductos = await getData()

//   try {
//     dataProductos.forEach((producto) => {
//       producto.precio -= (producto.precio * porcentaje) / 100;
//     });

//     await writeFile(
//       "./data/productos.json",
//       JSON.stringify(dataProductos, null, 2)
//     );

//     res.json({ message: "Precios de los productos actualizados con éxito" });
//   } catch (error) {
//     res.status(500).json({
//       message: "Error al actualizar los precios de los productos",
//       error: error.message,
//     });
//   }
// });

// // Eliminar producto

// router.delete("/delete/:id_producto", async (req, res) => {
//   const id_producto = parseInt(req.params.id_producto);
//   const dataProductos = await getData()

//   try {
//     const i = dataProductos.findIndex((e) => e.id_producto == id_producto);

//     if (i !== -1) {
//       dataProductos.splice(i, 1);
//       writeFile("./data/productos.json", JSON.stringify(dataProductos, null, 2));
//       res.json({ message: "Producto eliminado con éxito" });
//     } else {
//       res.send(200).json("No se encontro al producto");
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error al eliminar el producto" });
//   }
// });


