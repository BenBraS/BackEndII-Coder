import { cartRepository } from '../services/index.js';
import Ticket from '../models/ticket.js';


export const createCart = async (req, res) => {
    try {
        const newCart = await cartRepository.createCart();
        res.status(201).send(newCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cart = await cartRepository.getCartById(req.params.id);
        if (!cart) return res.status(404).send('Carrito no encontrado');
        res.send(cart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
export const purchaseCart = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartRepository.getCartById(cartId);
        
        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        let totalAmount = 0;
        let unavailableProducts = [];

        // Procesar los productos en el carrito
        for (let item of cart.products) {
            const product = item.productId;  // Producto desde el carrito
            if (product.stock >= item.quantity) {
                // Restar del stock
                product.stock -= item.quantity;
                await product.save();

                // Sumar al total de la compra
                totalAmount += product.price * item.quantity;
            } else {
                // Producto no disponible
                unavailableProducts.push(product._id);
            }
        }

        // Filtrar productos no disponibles
        cart.products = cart.products.filter(item => !unavailableProducts.includes(item.productId._id));
        await cart.save();

        // Generar un ticket si hubo compra
        if (totalAmount > 0) {
            const ticket = new Ticket({
                amount: totalAmount,
                purchaser: req.user.email,  // Asumiendo que el correo está en req.user
            });
            await ticket.save();
        }

        res.json({
            message: 'Compra completada',
            unavailableProducts,  // Lista de productos no disponibles
        });

    } catch (error) {
        console.error(error);  // Imprimir el error completo en consola
        res.status(500).json({ message: 'Error procesando la compra', error: error.message });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const { id, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartRepository.addProductToCart(id, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const removeProductFromCart = async (req, res) => {
    try {
        const { id, pid } = req.params;
        const updatedCart = await cartRepository.removeProductFromCart(id, pid);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const result = await cartRepository.deleteCart(req.params.id);
        res.status(200).send(result);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const updateCartWithProducts = async (req, res) => {
    try {
        const updatedCart = await cartRepository.updateCartWithProducts(req.params.id, req.body.products);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

export const updateProductQuantityInCart = async (req, res) => {
    try {
        const { id, pid } = req.params;
        const { quantity } = req.body;
        const updatedCart = await cartRepository.updateProductQuantityInCart(id, pid, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};


export const getCartByUserId = async (req, res) => {
    try {
        const userId = req.user.id;
        const cart = await cartRepository.getCartByUserId(userId);
        
        if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

        const cartProducts = cart.products.map(product => {
            console.log('Product Details:', product.productId); // Agregar impresión para verificar detalles del producto
            const price = product.productId.price || 0;
            const quantity = product.quantity || 0;
            const subtotal = price * quantity;

            return {
                _id: product.productId._id,
                title: product.productId.title,
                description: product.productId.description,
                code: product.productId.code,
                price,
                quantity,
                subtotal
            };
        });

        const totalPrice = cartProducts.reduce((total, product) => total + product.subtotal, 0);

        res.json({ cartProducts, totalPrice });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
};
