import { cartRepository } from '../services/index.js';

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
