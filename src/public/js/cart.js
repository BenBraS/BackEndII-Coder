// // cart.js

// function getCartId() {
//     return localStorage.getItem('cartId');
// }

// function setCartId(cartId) {
//     localStorage.setItem('cartId', cartId);
// }

// // Mostrar productos del carrito
// async function showCartProducts() {
//     const cartId = getCartId();
//     if (!cartId) {
//         alert('No hay un carrito seleccionado.Agregue items con el botón  +  y elimine con el botón - . Luego, refresque la página para ver productos en carrito.');
//         return;
//     }

//     try {
//         const response = await fetch(`/api/carts/${cartId}/products`);
//         const products = await response.json();

//         const cartTableBody = document.getElementById('cart-products');
//         cartTableBody.innerHTML = '';

//         products.forEach(product => {
//             const row = document.createElement('tr');
//             row.innerHTML = `
//                 <td>${product.productId.title}</td>
//                 <td>${product.productId.description}</td>
//                 <td>${product.productId.code}</td>
//                 <td>${product.productId.price}</td>
//                 <td>${product.quantity}</td>
//             `;
//             cartTableBody.appendChild(row);
//         });
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // Actualizar cantidad del producto
// async function updateProductQuantity(productId, change) {
//     const cartId = getCartId();
//     if (!cartId) {
//         alert('No hay un carrito seleccionado.');
//         return;
//     }

//     try {
//         const response = await fetch(`/api/carts/${cartId}/products/${productId}`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ quantity: change }),
//         });

//         const result = await response.json();
//         if (result.message === 'Carrito vacío y eliminado') {
//             localStorage.removeItem('cartId');
//         }

//         showCartProducts(); // Refrescar productos
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// // Crear carrito
// async function createCart() {
//     try {
//         const response = await fetch('/api/carts/', { method: 'POST' });
//         const result = await response.json();
//         setCartId(result._id);
//     } catch (error) {
//         console.error('Error:', error);
//     }
// }

// document.addEventListener('DOMContentLoaded', () => {
//     if (!getCartId()) {
//         createCart();
//     }
//     showCartProducts();
// });
function updateProductQuantity(productId, quantity) {
    // Verifica si el usuario está autenticado
    fetch('/api/sessions/current', { method: 'GET' })
      .then(response => {
        // Si el estado de la respuesta no es 200, verifica si es un 401 (no autorizado)
        if (!response.ok) {
          if (response.status === 401) {
            // Si no está autenticado, redirigir a la página de login
            window.location.href = '/api/sessions/login'; // Ajusta la URL según sea necesario
          } else {
            // Maneja otros posibles errores de la respuesta
            throw new Error('Error en la verificación de autenticación');
          }
        }
        return response.json();
      })
      .then(data => {
        if (!data.user) {
          // Si no se encuentra un usuario en la respuesta, redirigir a login
          window.location.href = '/api/sessions/login';
        } else {
          // Asegúrate de que el cartId es solo el ID y no un objeto
          const cartId = data.user.cart._id || data.user.cart; // Aquí se asegura de que cartId sea un string
  
          // Si el usuario está autenticado, agregar el producto al carrito
          fetch(`/api/carts/${cartId}/products/${productId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ quantity: quantity }),
          })
            .then(response => response.json())
            .then(updatedCart => {
              // Aquí puedes actualizar la interfaz de usuario con el carrito actualizado
              console.log(updatedCart);
            })
            .catch(err => console.error('Error al agregar al carrito:', err));
        }
      })
      .catch(err => console.error('Error al verificar autenticación:', err));
  }
  