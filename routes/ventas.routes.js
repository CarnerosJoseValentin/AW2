import { Router } from "express";
import path from 'path';
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from 'url';
import { dirname } from 'path';


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

