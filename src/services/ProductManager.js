import productDaoMongo from '../daoMongo/productDaoMongo.js';

export default class ProductManager {
    constructor() {
        this.service = new productDaoMongo();
    }

    async getAllProducts(limit) {
        try {
            return await this.service.getAllProducts(limit);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await this.service.getProductById(id);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            return await this.service.addProduct(productData);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            return await this.service.updateProduct(id, updatedFields);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await this.service.deleteProduct(id);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    async getPaginatedProducts(page = 1, limit = 10, category = '', sort = 'title', order = 1) {
        try {
            return await this.service.getPaginatedProducts(page, limit, category, sort, order);
        } catch (error) {
            throw new Error('Error al obtener productos paginados');
        }
    }
}
