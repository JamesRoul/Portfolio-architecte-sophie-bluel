document.addEventListener('DOMContentLoaded', async (event) => {
  let allJobs = [];  // Declarar allJobs aquí
  const authToken = localStorage.getItem('authToken');
  console.log('authToken:', authToken);

  function verifyTokenAndSetState() {
    console.log('Verificando token...');
    const authToken = localStorage.getItem('authToken');
    const loginItem = document.getElementById('login-item');
    const logoutItem = document.getElementById('logout-item');
    
    console.log('loginItem:', loginItem);
    console.log('logoutItem:', logoutItem);

    if (loginItem && logoutItem) {
      if (authToken) {
        console.log('Usuario autenticado');
        loginItem.style.display = 'none';
        logoutItem.style.display = 'block';

        const adminHeader = document.querySelector('.adminHeader');
        const editContainer = document.querySelector('.edit-container');
        const categoryFilters = document.querySelector('.category-filters');
        const blueimElement = document.querySelector('.blueim');
        const modiftextElements = document.querySelectorAll('.modiftext');
        const editButton = document.querySelector('.ButtonModifier2');
        console.log('editButton:', editButton);
        const modal = document.getElementById('modal1');

        if (adminHeader) {
          adminHeader.style.display = 'block';
        }
        if (editContainer) {
          editContainer.style.display = 'block';
          // Agregar evento de clic al botón "Modifier" para abrir la modal
           
          if (editButton && modal) {
            modal.style.display = 'none';  // chack que la modal esté oculta inicialmente
            editButton.addEventListener('click', () => {
              const allJobs = JSON.parse(localStorage.getItem('allJobs'));
              updateModal(allJobs); // Llamada a la función updateModal para cargar las imágenes en la modal cada vez que se hace clic en el botón de editar
              console.log(modal.style.display);
              modal.style.display = 'block';
              
            });
          }
          
          function resetFormFields() {
            photoInput.value = '';
            titleInput.value = '';
            categorySelect.selectedIndex = 0;
            imageDiv.innerHTML= '';
          }
          const addPhotoForm = document.getElementById('add-photo-form');
          const formContainer = document.getElementById('form-container');
          const addPhotoButton = document.getElementById('add-photo');

          if (addPhotoForm && formContainer && addPhotoButton) {
            addPhotoButton.addEventListener('click', (event) => {
              event.preventDefault();
              formContainer.style.display = 'block';
              resetFormFields();
             
              
            });
          }
        }
             
        if (blueimElement) {
          blueimElement.style.display = 'block';
        }
        if (editButton) {
          editButton.style.display = 'block';
        }

        modiftextElements.forEach(element => {
          element.style.display = 'block';
        });

        if (categoryFilters) {
          categoryFilters.style.display = 'none';
        }
      } else {
        console.log('Usuario no autenticado');
        loginItem.style.display = 'block';
        logoutItem.style.display = 'none';

        const adminHeader = document.querySelector('.adminHeader');
        const editContainer = document.querySelector('.edit-container');
        const categoryFilters = document.querySelector('.category-filters');
        const blueimElement = document.querySelector('.blueim');
        const modiftextElements = document.querySelectorAll('.modiftext');

        if (adminHeader) {
          adminHeader.style.display = 'none';
        }
        if (editContainer) {
          editContainer.style.display = 'none';
        }
        if (blueimElement) {
          blueimElement.style.display = 'none';
        }

        modiftextElements.forEach(element => {
          element.style.display = 'none';
        });

        if (categoryFilters) {
          categoryFilters.style.display = 'block';
        }
      }
    }
  }

  async function displayJobs(jobs) {
    const galleryContainer = document.querySelector('.gallery');
    if (galleryContainer) {
      galleryContainer.innerHTML = '';
      const deletedPhotoIds = JSON.parse(localStorage.getItem('deletedPhotoIds')); // Obtener las IDs de las fotos eliminadas

      jobs.forEach(job => {
        
        const figure = document.createElement('figure');
        figure.setAttribute('data-photo-id', job.id); // Añadir atributo de datos para identificar la foto
        const image = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        image.src = job.imageUrl;
        image.alt = job.title;
        figcaption.textContent = job.title;

        figure.appendChild(image);
        figure.appendChild(figcaption);
        galleryContainer.appendChild(figure);
      });
    }
  }
  
  async function filterJobs(category) {
    const allJobs = JSON.parse(localStorage.getItem('allJobs'));
    const filteredJobs = category === 'Tous' ? allJobs : allJobs.filter(job => job.category.name === category);
    await displayJobs(filteredJobs);
  }
  
  function deletePhoto(photoId) {
    const authToken = localStorage.getItem('authToken');
  
    fetch(`http://localhost:5678/api/works/${photoId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
    .then(response => {
      if (response.ok) {
        console.log('La foto se eliminó correctamente');
        // Eliminar el elemento de la modal
        const modalImagesDiv = document.getElementById('fotomodal');
        const figureToDelete = modalImagesDiv.querySelector(`figure[data-photo-id="${photoId}"]`);
        if (figureToDelete) {
          figureToDelete.style.display = 'none';
        }
        // Eliminar el elemento de la galería
        const galleryContainer = document.querySelector('.gallery');
        const galleryImageToDelete = galleryContainer.querySelector(`figure[data-photo-id="${photoId}"]`);
        if (galleryImageToDelete) {
          galleryImageToDelete.remove();
        }
        // Actualizar la lista de trabajos en el almacenamiento local
        const allJobs = JSON.parse(localStorage.getItem('allJobs'));
        const updatedJobs = allJobs.filter(job => job.id !== photoId);
        localStorage.setItem('allJobs', JSON.stringify(updatedJobs));
  
        // Guardar la ID de la foto eliminada en el almacenamiento local
        const deletedPhotoIds = JSON.parse(localStorage.getItem('deletedPhotoIds')) || [];
        deletedPhotoIds.push(photoId);
        localStorage.setItem('deletedPhotoIds', JSON.stringify(deletedPhotoIds));
  
        // Actualizar la modal con la lista de trabajos actualizada
        updateModal(updatedJobs);
      } else {
        throw new Error('Error al eliminar la foto. Por favor, inténtalo de nuevo.');
      }
    })
    .catch(error => {
      console.error('Error al enviar la solicitud DELETE:', error);
    });
  }
  
  function updateModal(jobs) {
    const modalImagesDiv = document.getElementById('fotomodal');
  
    modalImagesDiv.innerHTML = ''; // Limpiar las imágenes anteriores.
  
    if (jobs && jobs.length > 0) { // Verificar si jobs es válido y no está vacío
      jobs.forEach(job => {
        const figure = document.createElement('figure');
        figure.setAttribute('data-photo-id', job.id); // Añadir atributo de datos para identificar la foto
  
        const image = document.createElement('img');
        const editButton = document.createElement('button');
        const enlargeIcon = document.createElement('i');
        const deleteIcon = document.createElement('i');
  
        image.src = job.imageUrl;
        image.classList.add('modal-image');
  
        editButton.textContent = 'Éditer';
        editButton.classList.add('edit-button');
        editButton.addEventListener('click', () => {
          // Acciones al hacer clic en el botón "Éditer"
          // Puedes abrir otra modal para editar la foto, por ejemplo
        });
  
        enlargeIcon.classList.add('fas', 'fa-search-plus', 'enlarge-icon');
        enlargeIcon.addEventListener('click', () => {
          // Acciones al hacer clic en el ícono de agrandar
          // Puedes implementar la lógica para mostrar la imagen en tamaño completo
        });
  
        deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon');
        deleteIcon.addEventListener('click', () => {
          const photoId = job.id;
          deletePhoto(photoId);
        });
  
        figure.appendChild(image);
        figure.appendChild(editButton);
        figure.appendChild(enlargeIcon);
        figure.appendChild(deleteIcon);
        modalImagesDiv.appendChild(figure);
      });
    }
  }

  // Resto del código...

  try {
    const worksResponse = await fetch('http://localhost:5678/api/works');
    const worksData = await worksResponse.json();
    allJobs = worksData;  // Asignar un valor a allJobs aquí
    localStorage.setItem('allJobs', JSON.stringify(allJobs));
    await displayJobs(allJobs);

    const categoriesResponse = await fetch('http://localhost:5678/api/categories');
    const categoriesData = await categoriesResponse.json();
    const categoryFilters = document.querySelector('.category-filters');
    

    if (categoryFilters) {
      categoriesData.forEach(category => {
        const menuItem = document.createElement('li');
        menuItem.classList.add('category-menu-item');
        menuItem.textContent = category.name;
        categoryFilters.querySelector('.category-menu').appendChild(menuItem);
      });

      const categoryMenuItems = document.querySelectorAll('.category-menu-item');

      categoryMenuItems.forEach(menuItem => {
        menuItem.addEventListener('click', () => {
          const selectedCategory = menuItem.textContent;
          filterJobs(selectedCategory);
        });
      });
    }
  } catch (error) {
    console.error('Error al recuperar los trabajos y las categorías:', error);
  }
  
  try {
    // Realizar una petición GET a la API para obtener las categorías
    const categoriesResponse = await fetch('http://localhost:5678/api/categories');
    const categoriesData = await categoriesResponse.json();

    // Referencia al select del formulario
    const categorySelect = document.getElementById('category-select');

    // Por cada categoría obtenida, crear una opción en el select
    categoriesData.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });

  } catch (error) {
    console.error('Error al recuperar las categorías:', error);
  }

  const closeButton = document.querySelector('.close');

  if (closeButton) {
    closeButton.addEventListener('click', () => {
      const modal = document.getElementById('modal1');
      if (modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  const closeButtonEdit = document.querySelector('.closee');

  if (closeButtonEdit) {
    closeButtonEdit.addEventListener('click', () => {
      const formContainer = document.getElementById('form-container');
      if (formContainer) {
        formContainer.style.display = 'none';
      }
    });
  }

  const backButton = document.querySelector('.back-form');

  if (backButton) {
    backButton.addEventListener('click', () => {
      const formContainer = document.getElementById('form-container');
      if (formContainer) {
        formContainer.style.display = 'none'; // Ocultar el contenedor del formulario
      }
      const modal1 = document.getElementById('modal1');
      if (modal1) {
        modal1.style.display = 'block'; // Mostrar la modal1
      }
    });
  }

  const form = document.getElementById('add-photo-form');
  const photoInput = document.getElementById('photo-input');
  const titleInput = document.getElementById('title-input');
  const categorySelect = document.getElementById('category-select');
  const photoPreview = document.getElementById('photo-preview');
  const imageDiv = document.querySelector('.ajout > div');

  photoInput.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file && imageDiv) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const image = document.createElement('img');
        image.src = e.target.result;
        image.onload = () => {
          const imageWidth = image.width;
          const imageHeight = image.height;
          const imageAspectRatio = imageWidth / imageHeight;
          const containerWidth = imageDiv.offsetWidth;
          const containerHeight = containerWidth / imageAspectRatio;
          imageDiv.style.height = `${containerHeight}px`;
        };
        imageDiv.innerHTML = '';
        imageDiv.appendChild(image);
      };

      reader.readAsDataURL(file);
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const file = photoInput.files[0];
    const title = titleInput.value;
    const categoryId = categorySelect.value;
  
    if (file && title && categoryId) {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('title', title);
      formData.append('category', categoryId);
  
      try {
        const response = await fetch('http://localhost:5678/api/works', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData,
        });
  
        if (response.ok) {
          const responseData = await response.json();
          console.error('Server response:', responseData);
          alert('La photo a bien été ajoutée!');
  
          // Aquí puedes agregar la nueva foto a la galería en el cliente
          const newPhoto = {
            id: responseData.id,
            title: title,
            imageUrl: responseData.imageUrl,
            categoryId: categoryId,
            userId: 1  // reemplaza esto con el ID de usuario actual
          };
          allJobs.push(newPhoto);
          localStorage.setItem('allJobs', JSON.stringify(allJobs));
          console.log('allJobs después de agregar la nueva foto:', allJobs);  // Aquí estás imprimiendo el estado de allJobs después de agregar la nueva foto
        
          await displayJobs(allJobs);
          updateModal(allJobs); // Actualizar la modal con la nueva foto

        
        } else {
          throw new Error('Error al agregar la foto. Por favor, inténtalo de nuevo.');
        }
      } catch (error) {
        console.error('Error al enviar el formulario:', error);
      }
    }
  });

  await verifyTokenAndSetState();
  function clearGallery() {
    const galleryContainer = document.querySelector('.gallery');
    galleryContainer.innerHTML = '';
  
    localStorage.removeItem('allJobs');
    localStorage.removeItem('deletedPhotoIds'); // Eliminar el registro de las IDs de fotos eliminadas
  }
  
  
  async function deletePhotos() {
    const authToken = localStorage.getItem('authToken');
  
    // Obtener todas las fotos de la galería
    const galleryContainer = document.querySelector('.gallery');
    const galleryImages = galleryContainer.querySelectorAll('figure');
  
    // Obtener las IDs de las fotos eliminadas del almacenamiento local
    const deletedPhotoIds = JSON.parse(localStorage.getItem('deletedPhotoIds')) || [];
  
    // Iterar sobre cada foto y enviar una solicitud DELETE para eliminarla
    galleryImages.forEach(async (image) => {
      const photoId = image.getAttribute('data-photo-id');
  
      try {
        const response = await fetch(`http://localhost:5678/api/works/${photoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
  
        if (response.ok) {
          console.log(`Se eliminó la foto con ID ${photoId}`);
          image.remove(); // Eliminar la imagen de la galería
  
          // Eliminar el elemento de la modal
          const modalImagesDiv = document.getElementById('fotomodal');
          const figureToDelete = modalImagesDiv.querySelector(`figure[data-photo-id="${photoId}"]`);
          if (figureToDelete) {
            figureToDelete.style.display = 'none';
          }
  
          // Agregar la ID de la foto eliminada al array de IDs eliminadas
          deletedPhotoIds.push(photoId);
        } else {
          throw new Error(`Error al eliminar la foto con ID ${photoId}`);
        }
      } catch (error) {
        console.error('Error al enviar la solicitud DELETE:', error);
      }
    });
  
    // Vaciar el almacenamiento local de las fotos eliminadas
    localStorage.removeItem('deletedPhotoIds');
  
    // Obtener la lista actualizada de trabajos filtrando las fotos eliminadas
    const allJobs = JSON.parse(localStorage.getItem('allJobs'));
    const updatedJobs = allJobs.filter(job => !deletedPhotoIds.includes(job.id));
    localStorage.setItem('allJobs', JSON.stringify(updatedJobs));
  }
  
  
  const submitButton = document.getElementById('delete-gallery');
  if (submitButton) {
    submitButton.addEventListener('click', async (event) => {
      event.preventDefault();
  
      const confirmation = confirm('Souhaitez-vous vraiment éliminer la gallerie?');
      if (confirmation) {
        try {
          const authToken = localStorage.getItem('authToken');
  
          const allJobs = JSON.parse(localStorage.getItem('allJobs'));
          const photoIdsToDelete = allJobs.map(job => job.id); // Obtener la lista de identificadores de fotos
  
          await deletePhotos(photoIdsToDelete); // Llamar a la función deletePhotos
  
          console.log('Se eliminaron todos los proyectos correctamente');
          // Eliminar los elementos de la galería
          const galleryContainer = document.querySelector('.gallery');
          galleryContainer.innerHTML = '';
  
          // También puedes eliminar los trabajos del almacenamiento local si es necesario
          localStorage.removeItem('allJobs');
        } catch (error) {
          console.error('Error al eliminar los proyectos. Por favor, inténtalo de nuevo:', error);
        }
      }
    });

    submitButton.addEventListener('mouseover', () => {
      submitButton.style.cursor = 'pointer';
    });
  }

  const logoutLink = document.getElementById('logout-item');

  if (logoutLink) {
    logoutLink.addEventListener('click', () => {
      localStorage.removeItem('authToken');
      window.location.href = 'http://localhost:5678';
    });
  }

});
