import Product from '../models/products.js'; // Asegúrate de ajustar la ruta según tu estructura

export default class ProductManager {
    constructor() {}

    async getAllProducts(limit) {
        try {
            const products = await Product.find().limit(limit || 0);
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    async getProductById(id) {
        try {
            const product = await Product.findById(id);
            return product || null;
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            throw error;
        }
    }

    async addProduct(productData) {
        try {
            // Verifica si el producto ya existe por su código
            const existingProduct = await Product.findOne({ code: productData.code });
            if (existingProduct) {
                // Si existe, suma el stock
                existingProduct.stock += productData.stock;
                await existingProduct.save();
                return existingProduct;
            }

            // Si no existe, crea un nuevo producto
            const newProduct = new Product(productData);
            await newProduct.save();
            return newProduct;
        } catch (error) {
            console.error('Error al agregar producto:', error);
            throw error;
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const product = await Product.findById(id);
            if (!product) return null;

            // Actualiza los campos correspondientes
            if ('stock' in updatedFields) {
                let currentStock = product.stock;
                let adjustment = Number(updatedFields.stock);

                // Calcular el nuevo stock
                let newStock = currentStock + adjustment;

                // Si el stock resultante es negativo, ajustarlo a 0 y establecer el estado en false
                product.stock = newStock < 0 ? 0 : newStock;
                product.status = product.stock > 0;
            }

            Object.assign(product, updatedFields); // Asigna los campos actualizados al producto
            await product.save();
            return product;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await Product.findByIdAndDelete(id);
            return deletedProduct || null;
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            throw error;
        }
    }
    async getPaginatedProducts(page = 1, limit = 10, category = '', sort = 'title', order = 1) {
        try {
            const options = {
                page: page,
                limit: limit,
                lean: true, // Para resultados planos
                sort: { [sort]: order } // Ordenar por campo dinámico
            };
    
            const filter = category ? { category: category } : {}; // Aplicar filtro de categoría si existe
            const result = await Product.paginate(filter, options); // Usar el filtro en la consulta
            return result;
        } catch (error) {
            throw new Error('Error al obtener productos paginados');
        }
    }
    

}
