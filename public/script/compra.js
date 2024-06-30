import { obtenerCarrito, vaciarCarrito } from './carrito.js';

const MENSAJES = {
  CARRITO_VACIO: 'El carrito está vacío',
  INICIAR_SESION: 'Por favor, inicie sesión para realizar la compra',
  ERROR_SESION: 'Hubo un problema con su sesión. Por favor, intente iniciar sesión nuevamente.',
  USUARIO_INCOMPLETO: 'Información de usuario incompleta. Por favor, inicie sesión nuevamente.',
  COMPRA_EXITOSA: (id) => `Compra realizada con éxito. ID de venta: ${id}`,
  ERROR_COMPRA: 'Hubo un error al procesar la compra'
};

function obtenerUsuario() {
  const usuarioString = sessionStorage.getItem('usuario');
  if (!usuarioString) {
    throw new Error(MENSAJES.INICIAR_SESION);
  }
  try {
    const usuario = JSON.parse(usuarioString);
    if (!usuario || !usuario.id) {
      throw new Error(MENSAJES.USUARIO_INCOMPLETO);
    }
    return usuario;
  } catch (error) {
    console.error('Error al parsear la información del usuario:', error);
    throw new Error(MENSAJES.ERROR_SESION);
  }
}

export async function realizarCompra() {
  try {
    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
      alert(MENSAJES.CARRITO_VACIO);
      return;
    }

    const usuario = obtenerUsuario();
    const ventaData = {
      id_usuario: usuario.id,
      items: carrito.map(item => ({
        id_producto: item.id_producto,
        cant: item.cant
      }))
    };

    const response = await fetch('/ventas/realizarCompra', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ventaData)
    });

    if (!response.ok) {
      throw new Error(MENSAJES.ERROR_COMPRA);
    }

    const result = await response.json();
    alert(MENSAJES.COMPRA_EXITOSA(result.venta.id));
    vaciarCarrito();
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}
