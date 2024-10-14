import {Router} from 'express'
import CartManager from '../services/CartManager.js'

const router = Router();
const cartManager = new CartManager();

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
      const newCart = await cartManager.createCart();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Obtener un carrito por su ID
  router.get('/:cid', async (req, res) => {
    try {
      const cart = await cartManager.getCartById(req.params.cid);
      res.json(cart);
    } catch (error) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  });
  // Obtener los productos de un carrito
router.get('/:cid/products', async (req, res) => {
    try {
      const cart = await cartManager.getCartById(req.params.cid);
      res.json(cart.products);
    } catch (error) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  });
  
  // Agregar un producto a un carrito
  router.post('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const updatedCart = await cartManager.addProductToCart(cid, pid, quantity || 1);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Eliminar un producto de un carrito
  router.delete('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const updatedCart = await cartManager.removeProductFromCart(cid, pid);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Vaciar un carrito (eliminar todos los productos)
  router.delete('/:cid', async (req, res) => {
    try {
      const clearedCart = await cartManager.clearCart(req.params.cid);
      res.json(clearedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Eliminar un carrito completamente
  router.delete('/delete/:cid', async (req, res) => {
    try {
      const result = await cartManager.deleteCart(req.params.cid);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Actualizar un carrito con un arreglo de productos
router.put('/:cid', async (req, res) => {
    try {
      const { cid } = req.params;
      const products = req.body.products; // Espera un arreglo de productos en el cuerpo de la solicitud
      
      if (!Array.isArray(products)) {
        return res.status(400).json({ error: 'El cuerpo de la solicitud debe contener un arreglo de productos' });
      }
  
      // Verifica si todos los productos tienen el formato correcto
      for (const product of products) {
        if (!product.productId || typeof product.quantity !== 'number') {
          return res.status(400).json({ error: 'Cada producto debe tener un productId y una cantidad' });
        }
      }
  
      const updatedCart = await cartManager.updateCartWithProducts(cid, products);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  // Actualizar solo la cantidad de ejemplares del producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
  
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ error: 'La cantidad debe ser un número positivo' });
      }
  
      const updatedCart = await cartManager.updateProductQuantityInCart(cid, pid, quantity);
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  
  export default router;