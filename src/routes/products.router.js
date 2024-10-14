import { Router } from 'express';
import ProductManager from '../services/ProductManager.js';
import socketServer from '../config/socketConfig.js';
import expressConfig from '../config/expressConfig.js';

const router = Router();
const productManager = new ProductManager();

// APIs
// GET

router.get('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const product = await productManager.getProductById(req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Producto no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});


// POST
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        // Validar campos obligatorios
        if (!title || !description || !code || !price || !stock || !category) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
        }

        // Validar stock
        const stockNumber = Number(stock);
        let status = true;
        if (isNaN(stockNumber) || stockNumber < 0) {
            status = false;
        }

        const newProduct = await productManager.addProduct({ title, description, code, price, stock: stockNumber, category, thumbnails, status });

        // Emitir evento de producto agregado
        const products = await productManager.getAllProducts();
        socketServer.emit('updateProducts', { products, message: 'Producto agregado exitosamente' });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al agregar producto' });
    }
});

// PUT
router.put('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const updatedFields = req.body;

        // Validar stock si está presente
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
            // Emitir evento de producto actualizado
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
});
// DELETE
router.delete('/:pid', async (req, res) => {
    try {
        const productId = req.params.pid;
        const deletedProduct = await productManager.deleteProduct(productId);
        // Emitir evento de producto agregado
        const products = await productManager.getAllProducts();
        socketServer.emit('updateProducts', { products, message: 'Producto Eliminado Exitosamente' }); // Eliminar el producto usando Mongoose
        res.status(201).json("succesfull")
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
});
export default router;

