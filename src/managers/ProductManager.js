import { productRepository } from '../services/index.js';
import socketServer from '../config/socketConfig.js'; // Agrega esto si socketServer es necesario en este archivo

class ProductManager {
    async getAllProducts(limit) {
        return await productRepository.getAllProducts(limit);
    }

    async getProductById(id) {
        return await productRepository.getProductById(id);
    }

    async addProduct(productData) {
        return await productRepository.addProduct(productData);
    }

    async updateProduct(id, updatedFields) {
        return await productRepository.updateProduct(id, updatedFields);
    }

    async deleteProduct(id) {
        return await productRepository.deleteProduct(id);
    }

    async getPaginatedProducts(page = 1, limit = 10, category = '', sort = 'title', order = 1) {
        return await productRepository.getPaginatedProducts(page, limit, category, sort, order);
    }
}

export default ProductManager;
