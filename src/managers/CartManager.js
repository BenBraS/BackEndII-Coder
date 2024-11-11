import Cart from '../models/carritos.js';
import Product from '../models/products.js';
import User from '../models/users.js';

class CartManager {
  createCart = async () => {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error('Error al crear un nuevo carrito');
    }
  };

  getCartById = async (cartId) => {
    try {
      const cart = await Cart.findById(cartId).populate('products.productId');
      if (!cart) throw new Error('Carrito no encontrado');
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito con ID ${cartId}`);
    }
  };

  addProductToCart = async (cartId, productId, quantity = 1) => {
    try {
      const cart = await this.getCartById(cartId);
      const product = await Product.findById(productId);
      if (!product) throw new Error('Producto no encontrado');

      const productIndex = cart.products.findIndex(p => p.productId.equals(productId));

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += quantity;
        if (cart.products[productIndex].quantity <= 0) {
          cart.products.splice(productIndex, 1);
        }
      } else if (quantity > 0) {
        cart.products.push({ productId, quantity });
      } else {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      if (cart.products.length === 0) {
        await this.deleteCart(cartId);
        return null;
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
    }
  };

  removeProductFromCart = async (cartId, productId) => {
    try {
      const cart = await this.getCartById(cartId);
      cart.products = cart.products.filter(p => !p.productId.equals(productId));

      if (cart.products.length === 0) {
        await this.deleteCart(cartId);
        return null;
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
  };

  deleteCart = async (cartId) => {
    try {
      const cart = await Cart.findByIdAndDelete(cartId);
      if (!cart) throw new Error('Carrito no encontrado');
      return { message: 'Carrito eliminado exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar el carrito: ${error.message}`);
    }
  };

  updateCartWithProducts = async (cartId, products) => {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');

      cart.products = products
        .filter(product => product.quantity > 0)
        .map(product => ({ productId: product.productId, quantity: product.quantity }));

      if (cart.products.length === 0) {
        await this.deleteCart(cartId);
        return null;
      }

      await cart.save();
      return cart.populate('products.productId');
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  };

  updateProductQuantityInCart = async (cartId, productId, quantity) => {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) throw new Error('Carrito no encontrado');

      const productIndex = cart.products.findIndex(p => p.productId.equals(productId));

      if (productIndex !== -1) {
        cart.products[productIndex].quantity = quantity;
        if (quantity <= 0) cart.products.splice(productIndex, 1);
      } else if (quantity > 0) {
        cart.products.push({ productId, quantity });
      } else {
        throw new Error('La cantidad debe ser mayor a 0');
      }

      if (cart.products.length === 0) {
        await this.deleteCart(cartId);
        return null;
      }

      await cart.save();
      return cart.populate('products.productId');
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
    }
  };

  getCartByUserId = async (userId) => {
    try {
      const user = await User.findById(userId).populate('cart');
      if (!user || !user.cart) throw new Error('Carrito no encontrado para este usuario');
      return user.cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito del usuario: ${error.message}`);
    }
  };
}

export default CartManager;
