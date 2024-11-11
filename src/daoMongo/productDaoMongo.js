import Product from "../models/products.js";

class ProductDaoMongo {
    constructor() {
        this.model = Product;
    }

    async getAllProducts(limit) {
        return await this.model.find().limit(limit || 0);
    }

    async getProductById(id) {
        return await this.model.findById(id);
    }

    async addProduct(productData) {
        // Verifica si el producto ya existe por su código
        const existingProduct = await this.model.findOne({ code: productData.code });
        if (existingProduct) {
            // Si existe, suma el stock
            existingProduct.stock += productData.stock;
            await existingProduct.save();
            return existingProduct;
        }

        // Si no existe, crea un nuevo producto
        const newProduct = new this.model(productData);
        await newProduct.save();
        return newProduct;
    }

    async updateProduct(id, updatedFields) {
        const product = await this.model.findById(id);
        if (!product) return null;

        // Actualiza los campos correspondientes
        if ('stock' in updatedFields) {
            let adjustment = Number(updatedFields.stock);
            let newStock = product.stock + adjustment;
            product.stock = newStock < 0 ? 0 : newStock;
            product.status = product.stock > 0;
            delete updatedFields.stock; // Evitar que el stock sea sobrescrito en el Object.assign
        }
        Object.assign(product, updatedFields); // Asigna los campos actualizados al producto
        await product.save();
        return product;
    }

    async deleteProduct(id) {
        return await this.model.findByIdAndDelete(id);
    }

    async getPaginatedProducts(page = 1, limit = 10, category = '', sort = 'title', order = 1) {
        const options = {
            page: page,
            limit: limit,
            lean: true, // Para resultados planos
            sort: { [sort]: order } // Ordenar por campo dinámico
        };

        const filter = category ? { category: category } : {}; // Aplicar filtro de categoría si existe
        const result = await this.model.paginate(filter, options); // Usar el filtro en la consulta
        return result;
    }
}

export default ProductDaoMongo;
