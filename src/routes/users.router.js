import express from 'express';
import {
  createUserWithCart,
  addProductToUserCart,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js';

const router = express.Router();
// Crea usuario con carrito asociado
router.post('/', createUserWithCart);
// Agregar producto al carrito de un usuario por ID
router.post('/:id/cart/products/:pid', addProductToUserCart);
// Obtener todos los usuarios
router.get('/', getAllUsers);
// Obtener usuario por ID
router.get('/:id', getUserById);
//Modificar Usuario
router.put('/:id', updateUser);
// Eliminar usuario
router.delete('/:id', deleteUser);

export default router;
