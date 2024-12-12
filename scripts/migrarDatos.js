import { readFile } from 'fs/promises';
import mongoose from 'mongoose';
import Usuario from '../models/Usuario.js';
import Producto from '../models/Producto.js';
import Venta from '../models/Venta.js';

const migrarDatos = async () => {
  try {

    await mongoose.connect('mongodb://localhost:27017/tienda_online', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Conectado a MongoDB');

    // Migrar Usuarios
    const usuariosJSON = JSON.parse(
      await readFile('./data/usuarios.json', 'utf-8')
    );
    for (const usuario of usuariosJSON) {
      await Usuario.findOneAndUpdate(
        { id_usuario: usuario.id_usuario },
        usuario,
        { upsert: true }
      );
    }
    console.log('Usuarios migrados exitosamente');

    // Migrar Productos
    const productosJSON = JSON.parse(
      await readFile('./data/productos.json', 'utf-8')
    );
    for (const producto of productosJSON) {
      await Producto.findOneAndUpdate(
        { id_producto: producto.id_producto },
        producto,
        { upsert: true }
      );
    }
    console.log('Productos migrados exitosamente');

    // Migrar Ventas
    const ventasJSON = JSON.parse(
      await readFile('./data/ventas.json', 'utf-8')
    );
    for (const venta of ventasJSON) {
      await Venta.findOneAndUpdate(
        { id: venta.id },
        venta,
        { upsert: true }
      );
    }
    console.log('Ventas migradas exitosamente');

    console.log('Migración completa');
    process.exit(0);
  } catch (error) {
    console.error('Error durante la migración:', error);
    process.exit(1);
  }
};

migrarDatos();