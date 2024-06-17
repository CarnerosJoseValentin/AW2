import { readFile } from 'fs/promises';

const fileUser = await readFile('./data/productos.json', 'utf-8');
const productos = JSON.parse(fileUser); 

export const obtenerIdProducto = (id) =>{
    return productos.find((product) => product.id_producto == id);
}
