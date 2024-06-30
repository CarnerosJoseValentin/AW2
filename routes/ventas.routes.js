import { Router } from "express";
import path from 'path';
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { obtenerIdUsuario, obtenerIdProducto, obtenerIdSucursal} from "../utils/obtenerDatos.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ventasFilePath = path.join(__dirname, '../data/ventas.json');
const productosFilePath = path.join(__dirname, '../data/productos.json');

const router = Router();

const getData = async (filePath) => {
  const fileContent = await readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

//Realizar compra

router.post('/realizarCompra', async (req, res) => {
  try {
    const { id_usuario, items } = req.body;
    const productos = await getData(productosFilePath);

   
    let ventas = await getData(ventasFilePath);

  
    const ultimaVenta = ventas[ventas.length - 1];
    const nuevoId = ultimaVenta ? ultimaVenta.id + 1 : 1;

  
    const fechaActual = new Date().toISOString().split('T')[0];


    const total = items.reduce((sum, item) => {
      const producto = productos.find(p => p.id_producto === item.id_producto);
      if (!producto) {
        throw new Error(`Producto con id ${item.id_producto} no encontrado`);
      }
      return sum + (producto.precio * item.cant);
    }, 0);


    const ventaCompleta = {
      id: nuevoId,
      id_usuario: id_usuario,
      fecha: fechaActual,
      total: parseFloat(total.toFixed(2)),
      id_sucursal: 1, 
      descripcion: items
    };

    ventas.push(ventaCompleta);

    await writeFile(ventasFilePath, JSON.stringify(ventas, null, 2));

    res.json({ message: 'Compra realizada con éxito', venta: ventaCompleta });
  } catch (error) {
    console.error('Error al procesar la compra:', error);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
});

export default router;

// Mostrar todas las ventas

// router.get("/all", async (req, res) => {
//   const dataVentas = await getData();
//   try {
//     res.status(200).json(dataVentas);
//   } catch (error) {
//     return res.status(500).json({ message: "Error al listar las ventas" });
//   }
// });

// // Mostrar ventas por sucursal

// router.get("/buscarPorSucursal/:id", async (req, res) => {
//   const id = parseInt(req.params.id);
//   const dataVentas = await getData();
//   try {
//     const sucursal = dataVentas.filter((e) => e.id_sucursal == id);
//     if (!sucursal) {
//       return res.status(400).json({ message: "Sucursal no encontrada" });
//     } else {
//       return res.json(sucursal);
//     }
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Error al buscar las ventas por sucursal" });
//   }
// });

// // Modificar monto de factura

// router.put("/modificarMontoFactura", async (req, res) => {
//   const id = parseInt(req.body.id);
//   const total = parseFloat(req.body.total);
//   const dataVentas = await getData();
//   try {
//     const venta = dataVentas.find((venta) => venta.id == id);
//     if (venta) {
//       venta.total = total;
//       await writeFile("./data/ventas.json", JSON.stringify(dataVentas, null, 2));

//       res.json({ message: "Monto de la factura actualizado con exito" });
//     } else {
//       return res.status(400).json({ message: "No se encontró la factura" });
//     }
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error al actualizar el monto de la factura" });
//   }
// });

// // Buscar ventas entre fecha y fecha

// router.post("/BuscarPorFecha", (req, res) => {
//   const desde = new Date(req.body.desde);
//   const hasta = new Date(req.body.hasta);

//   try {
//     const arr = dataVentas.filter((e) => {
//       const fechaVenta = new Date(e.fecha);
//       return fechaVenta >= desde && fechaVenta <= hasta;
//     });

//     const resultado = arr.map((e) => {
//       return {
//         id: e.id,
//         cliente: e.id_usuario,
//         fecha: e.fecha,
//         total: e.total,
//         id_suc: e.id_suc,
//       };
//     });

//     if (resultado.length > 0) {
//       res.status(200).json(resultado);
//     } else {
//       res
//         .status(400)
//         .json(
//           `No se encontraron productos entre las fechas ${req.body.desde} y ${req.body.hasta}`
//         );
//     }
//   } catch (error) {
//     res.status(500).json("Se produjo un error inesperado en la búsqueda.");
//   }
// });

// // // Buscar ventas detalladas entre fecha y fecha

// router.post("/detallePorFecha", (req, res) => {
//   const desde = new Date(req.body.desde);
//   const hasta = new Date(req.body.hasta);

//   let nombre;
//   let location;
//   let products;

//   try {
//     const arr = dataVentas.filter((e) => {
//       const fechaVenta = new Date(e.fecha);
//       return fechaVenta >= desde && fechaVenta <= hasta;
//     });

//     const resultado = arr.map((e) => {
//       nombre = obtenerIdUsuario(e.id_usuario);
//       nombre = nombre.nombre + " " + nombre.apellido;

//       location = obtenerIdSucursal(e.id_sucursal);
//       location = location.direccion;

//       products = e.descripcion.map((item) => {
//         const productoDetalle = obtenerIdProducto(item.id_producto);
//         return {
//           Articulos: productoDetalle.nombre,
//           Cantidad: item.cant,
//         };
//       });

//       return {
//         Id: e.id,
//         Cliente: nombre,
//         Fecha: e.fecha,
//         Total: "$ " + e.total,
//         Sucursal: location,
//         Productos: products,
//       };
//     });

//     if (resultado.length > 0) {
//       res.status(200).json(resultado);
//     } else {
//       res
//         .status(400)
//         .json(
//           `No se encontraron productos entre las fechas ${req.body.desde} y ${req.body.hasta}`
//         );
//     }
//   } catch (error) {
//     res.status(500).json("Se produjo un error inesperado en la búsqueda.");
//   }
// });

// // Eliminar venta

// router.delete("/delete/:id", (req, res) => {
//   const id = parseInt(req.params.id);

//   try {
//     const i = dataVentas.findIndex((e) => e.id == id);

//     if (i !== -1) {
//       dataVentas.splice(i, 1);
//       writeFile("./data/ventas.json", JSON.stringify(dataVentas, null, 2));
//       res.json({ message: "Venta eliminada con éxito" });
//     } else {
//       res.send(200).json("No se encontro la venta solicitada");
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Error al eliminar al eliminar la venta" });
//   }
// });
