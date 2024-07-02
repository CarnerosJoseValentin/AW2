import express from 'express';

import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import usuariosRouter from './routes/usuarios.routes.js';
import productosRouter from './routes/productos.routes.js';
import ventasRouter from './routes/ventas.routes.js';
// import sucursalesRouter from './routes/sucursales.routes.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'Public')));

app.use(express.json());

app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);
app.use('/ventas', ventasRouter);
// app.use('/sucursales', sucursalesRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

