import { Router } from 'express';
import ProductManager from '../services/ProductManager.js';

const router = Router();
const p = new ProductManager()

router.get('/', async (req, res) => {
    // Obtén parámetros de la consulta (query) con valores predeterminados
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category || ''; // Parámetro de categoría
    const sort = req.query.sort || 'title'; // Parámetro de ordenamiento
    const order = req.query.order === 'desc' ? -1 : 1; // Orden ascendente o descendente

    try {
        // Obtén los productos paginados y filtrados por categoría
        const result = await p.getPaginatedProducts(page, limit, category, sort, order);
        res.render('home', { result, category, sort, order });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos');
    }
});

// Ruta para la vista "realTimeProducts"
router.get('/realtimeproducts', async (req, res) => {
    const products = await p.getAllProducts();
    res.render('realTimeProducts', { products });
});


export default router;
