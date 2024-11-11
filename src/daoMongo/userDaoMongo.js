import User from '../models/users.js'; 
import CartManager from '../managers/CartManager.js';

const cartManager = new CartManager();

class UserDaoMongo {
    async createUser(userData) {
        try {
            const newUser = new User(userData);
            await newUser.save();
            return newUser;
        } catch (error) {
            throw new Error('Error al crear un nuevo usuario: ' + error.message);
        }
    }

    async getAllUsers() {
        try {
            return await User.find();
        } catch (error) {
            throw new Error('Error al obtener los usuarios: ' + error.message);
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.findById(userId).populate('cart');
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        } catch (error) {
            throw new Error(`Error al obtener el usuario con ID ${userId}: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user || null;
        } catch (error) {
            throw new Error(`Error al obtener el usuario con email ${email}: ${error.message}`);
        }
    }

    async updateUser(userId, updateData) {
        try {
            const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        } catch (error) {
            throw new Error(`Error al actualizar el usuario con ID ${userId}: ${error.message}`);
        }
    }

    async deleteUser(userId) {
        try {
            const user = await User.findByIdAndDelete(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return { message: 'Usuario eliminado exitosamente' };
        } catch (error) {
            throw new Error(`Error al eliminar el usuario con ID ${userId}: ${error.message}`);
        }
    }

    async updateUserRole(userId, role) {
        try {
            const user = await User.findByIdAndUpdate(userId, { role }, { new: true });
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            return user;
        } catch (error) {
            throw new Error(`Error al actualizar el rol del usuario con ID ${userId}: ${error.message}`);
        }
    }
}

export default UserDaoMongo;
