import { Router } from "express";
import Venta from "../models/Venta.js";
import Producto from "../models/Producto.js";
import Usuario from "../models/Usuario.js";

const router = Router();

// Realizar compra
router.post('/realizarCompra', async (req, res) => {
  try {
    const { id_usuario, items } = req.body;

    // Verificar si el usuario existe
    const usuarioExiste = await Usuario.findOne({ id_usuario });
    if (!usuarioExiste) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Calcular el total y verificar productos
    let total = 0;
    for (const item of items) {
      const producto = await Producto.findOne({ id_producto: item.id_producto });
      if (!producto) {
        return res.status(404).json({ 
          error: `Producto con id ${item.id_producto} no encontrado` 
        });
      }
      total += producto.precio * item.cant;
    }

    // Crear nueva venta
    const ventaCompleta = new Venta({
      id_usuario,
      fecha: new Date(),
      total: parseFloat(total.toFixed(2)),
      id_sucursal: 1,
      descripcion: items
    });

    // Guardar la venta
    await ventaCompleta.save();

    res.json({ 
      message: 'Compra realizada con éxito', 
      venta: ventaCompleta 
    });

  } catch (error) {
    console.error('Error al procesar la compra:', error);
    res.status(500).json({ error: 'Error al procesar la compra' });
  }
});

// Obtener todas las ventas
router.get('/all', async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas:', error);
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
});

// Obtener ventas por usuario
router.get('/usuario/:id_usuario', async (req, res) => {
  try {
    const id_usuario = parseInt(req.params.id_usuario);
    const ventas = await Venta.find({ id_usuario }).sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener las ventas del usuario:', error);
    res.status(500).json({ error: 'Error al obtener las ventas del usuario' });
  }
});

// Script para migrar datos de JSON a MongoDB (opcional)
const migrarVentas = async () => {
  try {
    const jsonData = await readFile("./data/ventas.json", "utf-8");
    const ventas = JSON.parse(jsonData);
    
    for (const venta of ventas) {
      // Convertir la fecha string a objeto Date
      venta.fecha = new Date(venta.fecha);
      
      await Venta.findOneAndUpdate(
        { id: venta.id },
        venta,
        { upsert: true, new: true }
      );
    }
    
    console.log('Migración de ventas completada con éxito');
  } catch (error) {
    console.error('Error en la migración de ventas:', error);
  }
};

export default router;