import { readFile } from 'fs/promises';

const fileUser = await readFile('./data/usuarios.json', 'utf-8');
const usuarios = JSON.parse(fileUser); 

export const obtenerIdUsuario = (id) =>{
    return usuarios.find((user) => user.id == id);
}

