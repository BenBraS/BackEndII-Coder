import { Router } from 'express';
import {
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getPaginatedProducts
} from '../controllers/products.controller.js';

const router = Router();

// Obtener productos paginados
router.get('/', getPaginatedProducts);
// Obtener un producto por ID
router.get('/:pid', getProductById);
// Agregar un nuevo producto
router.post('/', addProduct);
// Modificar producto
router.put('/:pid', updateProduct);
// Eliminar producto
router.delete('/:pid', deleteProduct);

export default router;
