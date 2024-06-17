import { readFile } from 'fs/promises';

const fileUser = await readFile('./data/sucursales.json', 'utf-8');
const sucursales = JSON.parse(fileUser); 

export const obtenerIdSucursal = (id) =>{
    return sucursales.find((sucursal) => sucursal.id_sucursal == id);
}