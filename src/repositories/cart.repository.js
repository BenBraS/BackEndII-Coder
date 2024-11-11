import CartDaoMongo from '../daoMongo/cartDaoMongo.js';

class CartRepository {
    constructor() {
        this.cartDao = new CartDaoMongo();
    }

    async createCart() {
        return await this.cartDao.createCart();
    }

    async getCartById(cartId) {
        return await this.cartDao.getCartById(cartId);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await this.cartDao.addProductToCart(cartId, productId, quantity);
    }

    async removeProductFromCart(cartId, productId) {
        return await this.cartDao.removeProductFromCart(cartId, productId);
    }

    async deleteCart(cartId) {
        return await this.cartDao.deleteCart(cartId);
    }

    async updateCartWithProducts(cartId, products) {
        return await this.cartDao.updateCartWithProducts(cartId, products);
    }

    async updateProductQuantityInCart(cartId, productId, quantity) {
        return await this.cartDao.updateProductQuantityInCart(cartId, productId, quantity);
    }

    async getCartByUserId(userId) {
        return await this.cartDao.getCartByUserId(userId);
    }
}

export default CartRepository;
