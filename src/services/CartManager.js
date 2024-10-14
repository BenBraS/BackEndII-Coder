import Cart from '../models/carritos.js';
import Product from '../models/products.js';

class CartManager {
  // Crear un nuevo carrito vacío
  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      throw new Error('Error al crear un nuevo carrito');
    }
  }

  // Obtener un carrito por su ID
  async getCartById(cartId) {
    try {
      const cart = await Cart.findById(cartId).populate('products.productId');
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return cart;
    } catch (error) {
      throw new Error(`Error al obtener el carrito con ID ${cartId}`);
    }
  }

  // Agregar un producto a un carrito
  async addProductToCart(cartId, productId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const product = await Product.findById(productId);

      if (!product) {
        throw new Error('Producto no encontrado');
      }

      const productIndex = cart.products.findIndex(p => p.productId.equals(productId));

      if (productIndex !== -1) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        cart.products[productIndex].quantity += quantity;

        // Eliminar el producto del carrito si la cantidad es 0 o menor
        if (cart.products[productIndex].quantity <= 0) {
          cart.products.splice(productIndex, 1);
        }
      } else {
        // Si el producto no está, agregarlo al carrito
        if (quantity > 0) {
          cart.products.push({ productId, quantity });
        } else {
          throw new Error('La cantidad debe ser mayor a 0');
        }
      }

      // Eliminar el carrito si no hay productos
      if (cart.products.length === 0) {
        await this.deleteCart(cartId);
        return null; // Retornamos null si el carrito se elimina
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al agregar el producto al carrito: ${error.message}`);
    }
  }

  // Eliminar un producto de un carrito
  async removeProductFromCart(cartId, productId) {
    try {
      const cart = await this.getCartById(cartId);

      cart.products = cart.products.filter(p => !p.productId.equals(productId));

      // Eliminar el carrito si no hay productos
      if (cart.products.length === 0) {
        await this.deleteCart(cartId);
        return null; // Retornamos null si el carrito se elimina
      }

      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error al eliminar el producto del carrito: ${error.message}`);
    }
  }

  // Eliminar un carrito
  async deleteCart(cartId) {
    try {
      const cart = await Cart.findByIdAndDelete(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }
      return { message: 'Carrito eliminado exitosamente' };
    } catch (error) {
      throw new Error(`Error al eliminar el carrito: ${error.message}`);
    }
  }
// Actualizar un carrito con un arreglo de productos
async updateCartWithProducts(cartId, products) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      // Limpiar los productos actuales
      cart.products = [];

      // Agregar los nuevos productos
      for (const product of products) {
        if (product.quantity > 0) {
          cart.products.push({ productId: product.productId, quantity: product.quantity });
        }
      }

      if (cart.products.length === 0) {
        await this.deleteCart(cartId);
        return null; // Retornamos null si el carrito se elimina
      }

      await cart.save();
      return cart.populate('products.productId'); // Rellenar detalles del producto
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${error.message}`);
    }
  }

  // Actualizar solo la cantidad de ejemplares del producto en el carrito
  async updateProductQuantityInCart(cartId, productId, quantity) {
    try {
      const cart = await Cart.findById(cartId);
      if (!cart) {
        throw new Error('Carrito no encontrado');
      }

      const productIndex = cart.products.findIndex(p => p.productId.equals(productId));

      if (productIndex !== -1) {
        // Actualizar la cantidad del producto
        cart.products[productIndex].quantity = quantity;

        // Eliminar el producto del carrito si la cantidad es 0 o menor
        if (cart.products[productIndex].quantity <= 0) {
          cart.products.splice(productIndex, 1);
        }
      } else {
        // Agregar el producto al carrito si no existe y la cantidad es positiva
        if (quantity > 0) {
          cart.products.push({ productId, quantity });
        } else {
          throw new Error('La cantidad debe ser mayor a 0');
        }
      }

      if (cart.products.length === 0) {
        await this.deleteCart(cartId);
        return null; // Retornamos null si el carrito se elimina
      }

      await cart.save();
      return cart.populate('products.productId'); // Rellenar detalles del producto
    } catch (error) {
      throw new Error(`Error al actualizar la cantidad del producto en el carrito: ${error.message}`);
    }
  }
}

export default CartManager;
