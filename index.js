import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './db/database.js';

// Importación de rutas
import usuariosRouter from './routes/usuarios.routes.js';
import productosRouter from './routes/productos.routes.js';
import ventasRouter from './routes/ventas.routes.js';
// import sucursalesRouter from './routes/sucursales.routes.js';


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(express.static(path.join(__dirname, 'Public')));
app.use(express.json());


connectDB();


app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);
// app.use('/sucursales', sucursalesRouter);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});


app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});