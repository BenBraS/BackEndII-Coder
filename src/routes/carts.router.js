import { Router } from 'express';
import passport from 'passport';
import { authorizeRole } from '../middlewares/authMiddleware.js';
import { 
    createCart, 
    getCartById,  
    addProductToCart, 
    removeProductFromCart, 
    deleteCart, 
    updateCartWithProducts, 
    updateProductQuantityInCart, 
    getCartByUserId,
    purchaseCart 
} from '../controllers/cart.controller.js';


const router = Router();

// Crear un nuevo carrito
router.post('/', createCart);

// Obtener un carrito por su ID
router.get('/:cid', getCartById);


// Agregar un producto a un carrito
router.post('/:cid/products/:pid', passport.authenticate('jwt', { session: false }), authorizeRole(['user']), addProductToCart);

// Eliminar un producto de un carrito
router.delete('/:cid/products/:pid', removeProductFromCart);

// Vaciar un carrito (eliminar todos los productos)
router.delete('/:cid', deleteCart);

// Eliminar un carrito completamente
router.delete('/delete/:cid', deleteCart);

// Actualizar un carrito con un arreglo de productos
router.put('/:cid', updateCartWithProducts);

// Actualizar solo la cantidad de ejemplares del producto en el carrito
router.put('/:cid/products/:pid', updateProductQuantityInCart);

 //Obtener el carrito del usuario autenticado y calcular el precio total 
router.get('/', passport.authenticate('jwt', { session: false }), getCartByUserId);

router.post('/:cid/purchase',passport.authenticate('jwt', { session: false }), purchaseCart);

export default router;
