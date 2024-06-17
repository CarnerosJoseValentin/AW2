import { Router } from "express";
import { readFile, writeFile } from "fs/promises";

import { obtenerIdUsuario } from "../utils/user.js";
import { obtenerIdProducto } from "../utils/product.js";
import { obtenerIdSucursal } from "../utils/store.js";

const router = Router();

const fileUser = await readFile("./data/ventas.json", "utf-8");
const ventas = JSON.parse(fileUser);

// Mostrar todas las ventas

router.get("/all", async (req, res) => {
  try {
    res.status(200).json(ventas);
  } catch (error) {
    return res.status(500).json({ message: "Error al listar las ventas" });
  }
});

// Mostrar ventas por sucursal

router.get("/buscarPorSucursal/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const sucursal = ventas.filter((e) => e.id_sucursal == id);
    if (!sucursal) {
      return res.status(400).json({ message: "Sucursal no encontrada" });
    } else {
      return res.json(sucursal);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al buscar las ventas por sucursal" });
  }
});

// Modificar monto de factura

router.put("/modificarMontoFactura", async (req, res) => {
  const id = parseInt(req.body.id);
  const total = parseFloat(req.body.total);

  try {
    const venta = ventas.find((venta) => venta.id == id);
    if (venta) {
      venta.total = total;
      await writeFile("./data/ventas.json", JSON.stringify(ventas, null, 2));

      res.json({ message: "Monto de la factura actualizado con exito" });
    } else {
      return res.status(400).json({ message: "No se encontró la factura" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al actualizar el monto de la factura" });
  }
});

// Buscar ventas entre fecha y fecha

router.post("/BuscarPorFecha", (req, res) => {
  const desde = new Date(req.body.desde);
  const hasta = new Date(req.body.hasta);

  try {
    const arr = ventas.filter((e) => {
      const fechaVenta = new Date(e.fecha);
      return fechaVenta >= desde && fechaVenta <= hasta;
    });

    const resultado = arr.map((e) => {
      return {
        id: e.id,
        cliente: e.id_usuario,
        fecha: e.fecha,
        total: e.total,
        id_suc: e.id_suc,
      };
    });

    if (resultado.length > 0) {
      res.status(200).json(resultado);
    } else {
      res
        .status(400)
        .json(
          `No se encontraron productos entre las fechas ${req.body.desde} y ${req.body.hasta}`
        );
    }
  } catch (error) {
    res.status(500).json("Se produjo un error inesperado en la búsqueda.");
  }
});

// // Buscar ventas detalladas entre fecha y fecha

router.post("/detallePorFecha", (req, res) => {
  const desde = new Date(req.body.desde);
  const hasta = new Date(req.body.hasta);

  let nombre;
  let location;
  let products;

  try {
    const arr = ventas.filter((e) => {
      const fechaVenta = new Date(e.fecha);
      return fechaVenta >= desde && fechaVenta <= hasta;
    });

    const resultado = arr.map((e) => {
      nombre = obtenerIdUsuario(e.id_usuario);
      nombre = nombre.nombre + " " + nombre.apellido;

      location = obtenerIdSucursal(e.id_sucursal);
      location = location.direccion;

      products = e.descripcion.map((item) => {
        const productoDetalle = obtenerIdProducto(item.id_producto);
        return {
          Articulos: productoDetalle.nombre,
          Cantidad: item.cant,
        };
      });

      return {
        Id: e.id,
        Cliente: nombre,
        Fecha: e.fecha,
        Total: "$ " + e.total,
        Sucursal: location,
        Productos: products,
      };
    });

    if (resultado.length > 0) {
      res.status(200).json(resultado);
    } else {
      res
        .status(400)
        .json(
          `No se encontraron productos entre las fechas ${req.body.desde} y ${req.body.hasta}`
        );
    }
  } catch (error) {
    res.status(500).json("Se produjo un error inesperado en la búsqueda.");
  }
});

// Eliminar venta

router.delete("/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const i = ventas.findIndex((e) => e.id == id);

    if (i !== -1) {
      ventas.splice(i, 1);
      writeFile("./data/ventas.json", JSON.stringify(ventas, null, 2));
      res.json({ message: "Venta eliminada con éxito" });
    } else {
      res.send(200).json("No se encontro la venta solicitada");
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar al eliminar la venta" });
  }
});

export default router;
