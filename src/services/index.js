import ProductRepository from '../repositories/products.repository.js';
import UserRepository from '../repositories/user.repository.js';
import CartRepository from '../repositories/cart.repository.js';

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const userRepository = new UserRepository();

export { productRepository, userRepository, cartRepository };
