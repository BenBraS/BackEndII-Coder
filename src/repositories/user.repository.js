import UserDaoMongo from '../daoMongo/userDaoMongo.js';

class UserRepository {
    constructor() {
        this.userDao = new UserDaoMongo();
    }

    async createUserWithCart(userData) {
        return await this.userDao.createUserWithCart(userData);
    }

    async addProductToUserCart(userId, productId, quantity) {
        return await this.userDao.addProductToUserCart(userId, productId, quantity);
    }

    async getAllUsers() {
        return await this.userDao.getAllUsers();
    }

    async getUserById(userId) {
        return await this.userDao.getUserById(userId);
    }

    async updateUser(userId, updateData) {
        return await this.userDao.updateUser(userId, updateData);
    }

    async deleteUser(userId) {
        return await this.userDao.deleteUser(userId);
    }
}

export default UserRepository;
