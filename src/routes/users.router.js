import express from 'express';
import UserManager from '../services/UserManager.js'; 
import CartManager from '../services/CartManager.js';

const router = express.Router();
const userManager = new UserManager(); 
const cartManager = new CartManager();

// Crear un nuevo usuario con un carrito asociado
router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;

    // Crear un nuevo carrito para el usuario
    const cart = await cartManager.createCart(); 

    // Crear el nuevo usuario y asociar el carrito al usuario
    const newUser = await userManager.createUser({ 
      first_name, 
      last_name, 
      email, 
      age, 
      password,
      cart: cart._id  // Asocia el carrito al usuario
    });

    res.status(201).send(newUser);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Agregar un producto al carrito de un usuario
router.post('/:id/cart/products/:pid', async (req, res) => {
  try {
    const { id } = req.params; // ID del usuario
    const { pid } = req.params; // ID del producto
    const { quantity } = req.body; // Cantidad de producto a agregar

// Buscar el usuario por ID
    const user = await userManager.getUserById(id); 

    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }

// Agregar el producto al carrito del usuario
    const updatedCart = await cartManager.addProductToCart(user.cart, pid, quantity);

// Enviar respuesta con el carrito actualizado
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const users = await userManager.getAllUsers(); 
        res.send(users);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Obtener un usuario por ID
router.get('/:id', async (req, res) => {
    try {
      const user = await userManager.getUserById(req.params.id); 
      if (!user) return res.status(404).send('Usuario no encontrado');
      res.send(user);
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

// Actualizar un usuario
router.put('/:id', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password, role } = req.body;
        const updatedUser = await userManager.updateUser(req.params.id, { first_name, last_name, email, age, password, role });
        res.send(updatedUser);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
    try {
        await userManager.deleteUser(req.params.id);
        res.status(200).send({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});


export default router;
