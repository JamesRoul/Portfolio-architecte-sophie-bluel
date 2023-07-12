document.addEventListener('DOMContentLoaded', (event) => {
  const loginForm = document.querySelector('.login-form');

  if (loginForm) {
    loginForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('http://localhost:5678/api/users/login', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "email": email,
            "password": password
          })
        });

        if (!response.ok) {
          const data = await response.json(); // convertimos la respuesta en JSON
          // Si la API devuelve un error "user not found", alertamos al usuario
          if (data.message === 'user not found') {
            alert('No se encontró ninguna cuenta con este correo electrónico. Verifica tus credenciales e inténtalo de nuevo.');
          } else {
            throw new Error('Las informaciones de usuario / contraseña son incorrectas. Vuelve a intentarlo.');
          }
        } else {
          const data = await response.json();
          console.log(data);  // Imprime los datos de la respuesta

          if (data.token) {
            localStorage.setItem('authToken', data.token);
            console.log('Token guardado:', localStorage.getItem('authToken'));  // Nueva línea para depuración
            window.location.href = 'http://localhost:5678/index.html';
          }
        }
      } catch (error) {
        console.error('Error durante la autenticación:', error);
        alert('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
      }
    });
  }
});
