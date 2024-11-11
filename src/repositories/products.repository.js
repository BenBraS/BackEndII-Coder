import ProductDaoMongo from '../daoMongo/productDaoMongo.js';

class ProductRepository {
    constructor() {
        this.dao = new ProductDaoMongo();
    }

    async getAllProducts(limit) {
        try {
            return await this.dao.getAllProducts(limit);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            return await this.dao.getProductById(id);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            return await this.dao.addProduct(productData);
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            return await this.dao.updateProduct(id, updatedFields);
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            return await this.dao.deleteProduct(id);
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }

    async getPaginatedProducts(page = 1, limit = 10, category = '', sort = 'title', order = 1) {
        try {
            return await this.dao.getPaginatedProducts(page, limit, category, sort, order);
        } catch (error) {
            throw new Error('Error al obtener productos paginados');
        }
    }
}

export default ProductRepository;
