import express from 'express';
import usuariosRouter from './routes/usuarios.routes.js';
import productosRouter from './routes/productos.routes.js';
import sucursalesRouter from './routes/sucursales.routes.js';
import ventasRouter from './routes/ventas.routes.js';

const app = express();

const port = 3000;

app.use(express.json());

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
});

app.use('/usuarios', usuariosRouter);
app.use('/productos', productosRouter);
app.use('/sucursales', sucursalesRouter);
app.use('/ventas', ventasRouter);
