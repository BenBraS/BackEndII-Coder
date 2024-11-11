import ProductManager from '../managers/ProductManager.js';

const productManager = new ProductManager();

export const renderHome = async (req, res) => {
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

export const renderRealTimeProducts = async (req, res) => {
    try {
        const products = await productManager.getAllProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener productos en tiempo real');
    }
};
