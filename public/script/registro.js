export const registrarUsuario = async (userData) => {
  try {
    const { nombre, apellido, direccion, email, contraseña } = userData;

    if (!nombre || !apellido || !direccion || !email || !contraseña) {
      throw new Error('Todos los campos son obligatorios');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Correo electrónico inválido');
    }

    if (contraseña.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }

    const response = await fetch('/usuarios/usuarioNuevo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, apellido, direccion, email, contraseña }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al registrar usuario');
    }

    const data = await response.json();

    if (!data.usuario || !data.token) {
      throw new Error('Respuesta del servidor incompleta');
    }

    const usuario = {
      id: data.usuario.id_usuario,
      nombre: data.usuario.nombre,
      apellido: data.usuario.apellido,
      email: data.usuario.email,
      direccion: data.usuario.direccion,
    };

    console.log('Datos del usuario para almacenar:', usuario);

    sessionStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('token', data.token);

    const storedUser = sessionStorage.getItem('usuario');
    if (!storedUser) {
      throw new Error('No se pudieron guardar los datos en sessionStorage');
    }

    console.log('Datos guardados en sessionStorage:', storedUser);


    setTimeout(() => {
      window.location.href = '../pages/home.html';
    }, 100); 

    return {
      success: true,
      message: data.message,
      token: data.token,
      usuario: data.usuario,
    };
  } catch (error) {
    console.error('Error en el registro:', error.message);
    return {
      success: false,
      message: error.message || 'Error al registrar usuario',
    };
  }
};
