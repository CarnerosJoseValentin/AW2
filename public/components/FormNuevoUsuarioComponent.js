document.addEventListener('DOMContentLoaded', () => {

  const formularioContainer = document.createElement('div');
  formularioContainer.className = 'flex justify-center items-center min-h-screen bg-[url(../img/others/background_home.png)]';

  formularioContainer.innerHTML = `
      <div class="w-96 bg-black bg-opacity-50 border-4 border-black rounded-lg shadow-md">
        <div class="text-center p-6">
          <div class="mb-6">
            <img src="../img/others/logo.png" alt="logo" class="mx-auto w-75 h-25">
          </div>
          <h2 class="text-white text-2xl font-bold italic mb-6">Registro de Usuario</h2>
        
          <div id="mensajeError" class="text-red-500 text-sm mb-4 hidden"></div>
        
          <form id="formularioRegistro" class="space-y-6">
            <div>
              <label for="nombre" class="block mb-2 text-sm font-medium text-white italic font-bold">Nombre</label>
              <input 
                type="text" 
                name="nombre" 
                id="nombre" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black bg-opacity-50 text-white" 
                required
              >
              <p id="errorNombre" class="text-red-500 text-sm mt-1 hidden"></p>
            </div>
          
            <div>
              <label for="apellido" class="block mb-2 text-sm font-medium text-white italic font-bold">Apellido</label>
              <input 
                type="text" 
                name="apellido" 
                id="apellido" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black bg-opacity-50 text-white" 
                required
              >
              <p id="errorApellido" class="text-red-500 text-sm mt-1 hidden"></p>
            </div>
          
            <div>
              <label for="direccion" class="block mb-2 text-sm font-medium text-white italic font-bold">Dirección</label>
              <input 
                type="text" 
                name="direccion" 
                id="direccion" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black bg-opacity-50 text-white" 
                required
              >
              <p id="errorDireccion" class="text-red-500 text-sm mt-1 hidden"></p>
            </div>
          
            <div>
             <label for="email" class="block mb-2 text-sm font-medium text-white italic font-bold">Correo Electrónico</label>
              <input 
                type="email" 
                name="email" 
                id="email" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black bg-opacity-50 text-white" 
                required
              >
              <p id="errorEmail" class="text-red-500 text-sm mt-1 hidden"></p>
            </div>
          
            <div>
              <label for="contraseña" class="block mb-2 text-sm font-medium text-white italic font-bold">Contraseña</label>
              <input 
                type="password" 
                name="contraseña" 
                id="contraseña" 
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-black bg-opacity-50 text-white" 
                required
              >
              <p id="errorContraseña" class="text-red-500 text-sm mt-1 hidden"></p>
            </div>
          
            <button 
              type="submit" 
              class="block text-center text-gold text-lg transition-all duration-300 ease-in-out border-2 border-black hover:text-white hover:bg-gold hover:shadow-lg hover:scale-105 hover:font-bold py-2 px-4 rounded w-full mb-4"
            >
              Registrarse
            </button>
          </form>
        </div>
      </div>
  `;


  document.body.appendChild(formularioContainer);

  const formulario = document.getElementById('formularioRegistro');
  const mensajeError = document.getElementById('mensajeError');

  function validarCampo(input, errorElement, validaciones) {
    let error = '';
    
    validaciones.forEach(validacion => {
      if (!validacion.condicion(input.value)) {
        error = validacion.mensaje;
      }
    });

    if (error) {
      errorElement.textContent = error;
      errorElement.classList.remove('hidden');
      return false;
    } else {
      errorElement.textContent = '';
      errorElement.classList.add('hidden');
      return true;
    }
  }

  const validaciones = {
    nombre: [
      { 
        condicion: (valor) => valor.trim().length >= 2, 
        mensaje: 'El nombre debe tener al menos 2 caracteres' 
      }
    ],
    apellido: [
      { 
        condicion: (valor) => valor.trim().length >= 2, 
        mensaje: 'El apellido debe tener al menos 2 caracteres' 
      }
    ],
    direccion: [
      { 
        condicion: (valor) => valor.trim().length >= 5, 
        mensaje: 'La dirección debe tener al menos 5 caracteres' 
      }
    ],
    email: [
      { 
        condicion: (valor) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor), 
        mensaje: 'Introduce un correo electrónico válido' 
      }
    ],
    contraseña: [
      { 
        condicion: (valor) => valor.length >= 8, 
        mensaje: 'La contraseña debe tener al menos 8 caracteres' 
      },
      { 
        condicion: (valor) => /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(valor), 
        mensaje: 'La contraseña debe contener mayúsculas, minúsculas y números' 
      }
    ]
  };

  ['nombre', 'apellido', 'direccion', 'email', 'contraseña'].forEach(campo => {
    const input = document.getElementById(campo);
    const errorElement = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
    
    input.addEventListener('input', () => {
      validarCampo(input, errorElement, validaciones[campo]);
    });
  });

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    mensajeError.textContent = '';
    mensajeError.classList.add('hidden');

    let formularioValido = true;
    ['nombre', 'apellido', 'direccion', 'email', 'contraseña'].forEach(campo => {
      const input = document.getElementById(campo);
      const errorElement = document.getElementById(`error${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
      
      if (!validarCampo(input, errorElement, validaciones[campo])) {
        formularioValido = false;
      }
    });

    if (!formularioValido) return;

    const formData = {
      nombre: document.getElementById('nombre').value,
      apellido: document.getElementById('apellido').value,
      direccion: document.getElementById('direccion').value,
      email: document.getElementById('email').value,
      contraseña: document.getElementById('contraseña').value
    };

    try {
      const response = await fetch('/usuarios/usuarioNuevo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar usuario');
      }

      const usuario = {
        id: data.usuario.id_usuario,
        nombre: data.usuario.nombre,
        apellido: data.usuario.apellido
      };

      sessionStorage.setItem('usuario', JSON.stringify(usuario));

      localStorage.setItem('token', data.token);

      alert(data.message);

      window.location.href = '../pages/home.html';

    } catch (error) {
      mensajeError.textContent = error.message;
      mensajeError.classList.remove('hidden');
      console.error('Error en el registro:', error);
    }
  });
});
