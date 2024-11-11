import Cart from '../models/carritos.js';
import Product from '../models/products.js';
import User from '../models/users.js';

class CartDaoMongo {
    createCart = async () => {
        const newCart = new Cart({ products: [] });
        await newCart.save();
        return newCart;
    }

    getCartById = async (cartId) => {
        return await Cart.findById(cartId).populate('products.productId');
    }

    addProductToCart = async (cartId, productId, quantity) => {
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
    }

    removeProductFromCart = async (cartId, productId) => {
        const cart = await this.getCartById(cartId);
        cart.products = cart.products.filter(p => !p.productId.equals(productId));
        if (cart.products.length === 0) {
            await this.deleteCart(cartId);
            return null;
        }
        await cart.save();
        return cart;
    }

    deleteCart = async (cartId) => {
        return await Cart.findByIdAndDelete(cartId);
    }

    updateCartWithProducts = async (cartId, products) => {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');
        cart.products = products.filter(p => p.quantity > 0).map(p => ({ productId: p.productId, quantity: p.quantity }));
        if (cart.products.length === 0) {
            await this.deleteCart(cartId);
            return null;
        }
        await cart.save();
        return cart.populate('products.productId');
    }

    updateProductQuantityInCart = async (cartId, productId, quantity) => {
        const cart = await Cart.findById(cartId);
        if (!cart) throw new Error('Carrito no encontrado');
        const productIndex = cart.products.findIndex(p => p.productId.equals(productId));
        if (productIndex !== -1) {
            cart.products[productIndex].quantity = quantity;
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
        return cart.populate('products.productId');
    }

    getCartByUserId = async (userId) => {
        const user = await User.findById(userId).populate('cart');
        if (!user || !user.cart) throw new Error('Carrito no encontrado para este usuario');
        return user.cart;
    }
}

export default CartDaoMongo;
