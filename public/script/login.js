export function inicializarLogin() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const mensajeError = document.getElementById('mensajeError');
  
    loginForm.addEventListener('submit', handleSubmit);
  
    async function handleSubmit(e) {
      e.preventDefault();
      if (!emailInput.value || !passwordInput.value) {
        mostrarError('Por favor, complete todos los campos.');
        return;
      }
    
      try {
        const response = await fetch('/usuarios/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailInput.value,
            contraseña: passwordInput.value
          })
        });
    
        if (response.ok) {
          const data = await response.json();
          // Almacenar el token JWT
          localStorage.setItem('token', data.token);
          
          // Almacenar la información del usuario
          const usuario = {
            id: data.usuario.id_usuario,
            nombre: data.usuario.nombre,
            apellido: data.usuario.apellido,
            email: data.usuario.email,
            direccion: data.usuario.direccion
          };
          sessionStorage.setItem('usuario', JSON.stringify(usuario));
          
          window.location.href = '../pages/home.html';
        } else {
          const errorData = await response.json();
          mostrarError(errorData.message || 'Error al iniciar sesión');
        }
      } catch (error) {
        console.error('Error:', error);
        mostrarError('Se produjo un error al intentar ingresar al sistema');
      }
    }
  
    function mostrarError(mensaje) {
      mensajeError.textContent = mensaje;
      mensajeError.classList.remove('hidden');
    }
  }