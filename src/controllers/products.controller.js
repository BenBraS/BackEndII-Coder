import ProductManager from '../managers/ProductManager.js'
import socketServer from '../config/socketConfig.js';

const productManager = new ProductManager();

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
};

export const addProduct = async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        const stockNumber = Number(stock);
        let status = true;
        if (isNaN(stockNumber) || stockNumber < 0) {
            status = false;
        }

        const newProduct = await productManager.addProduct({ title, description, code, price, stock: stockNumber, category, thumbnails, status });

        const products = await productManager.getAllProducts();
        socketServer.emit('updateProducts', { products, message: 'Producto agregado exitosamente' });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;

        if ('stock' in updatedFields) {
            const stockNumber = Number(updatedFields.stock);
            let status = true;
            if (isNaN(stockNumber) || stockNumber < 0) {
                status = false;
                updatedFields.stock = 0;
            } else {
                updatedFields.stock = stockNumber;
            }
            updatedFields.status = status;
        }

        const updatedProduct = await productManager.updateProduct(productId, updatedFields);

        if (updatedProduct) {
            const products = await productManager.getAllProducts();
            socketServer.emit('updateProducts', { products, message: 'Producto actualizado exitosamente' });

            res.json(updatedProduct);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const productId = req.params.pid;
        const deletedProduct = await productManager.deleteProduct(productId);
        
        const products = await productManager.getAllProducts();
        socketServer.emit('updateProducts', { products, message: 'Producto eliminado exitosamente' });

        res.status(201).json("successful");
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar producto, ingrese ID de BBDD' });
    }
};

export const getPaginatedProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || '';
    const sort = req.query.sort || 'title';
    const order = req.query.order === 'desc' ? -1 : 1;

    try {
        const result = await productManager.getPaginatedProducts(page, limit, category, sort, order);
        res.render('home', { result, category, sort, order });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos');
    }
};
