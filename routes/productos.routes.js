import { Router } from "express";
import Producto from "../models/Producto.js";

const router = Router();

// Mostrar todos los Productos
router.get("/all", async (req, res) => {
  try {
    const productos = await Producto.find().sort({ id_producto: 1 });
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "Se produjo un error al listar los productos." 
    });
  }
});

// Listar producto por Id
router.get("/buscarProductoPorId/:id", async (req, res) => {
  try {
    const id_producto = parseInt(req.params.id);
    const producto = await Producto.findOne({ id_producto });

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(producto);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al buscar el producto" });
  }
});

// Listar producto por categoria
router.get("/buscarProductoPorCategoria/:categoria", async (req, res) => {
  try {
    const categoria = req.params.categoria;
    const productos = await Producto.find({
      categoria: { $regex: new RegExp(categoria, 'i') }
    });

    if (productos.length === 0) {
      return res.status(404).json({ 
        message: "No se encontraron productos en esta categoría" 
      });
    }

    return res.json(productos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al buscar los productos" });
  }
});

// Script para migrar datos de JSON a MongoDB (opcional)
const migrarProductos = async () => {
  try {
    const jsonData = await readFile("./data/productos.json", "utf-8");
    const productos = JSON.parse(jsonData);
    
    for (const producto of productos) {
      await Producto.findOneAndUpdate(
        { id_producto: producto.id_producto },
        producto,
        { upsert: true, new: true }
      );
    }
    
    console.log('Migración completada con éxito');
  } catch (error) {
    console.error('Error en la migración:', error);
  }
};

export default router;