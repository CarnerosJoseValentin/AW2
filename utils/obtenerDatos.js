import { readFile } from 'fs/promises';

const obtenerDatos = async (fileName, idKey, idValue) => {
    const fileData = await readFile(`./data/${fileName}.json`, 'utf-8');
    const data = JSON.parse(fileData);
    return data.find((item) => item[idKey] == idValue);
}

export const obtenerIdSucursal = (id) => obtenerDatos('sucursales', 'id_sucursal', id);
export const obtenerIdProducto = (id) => obtenerDatos('productos', 'id_producto', id);
export const obtenerIdUsuario = (id) => obtenerDatos('usuarios', 'id', id);
