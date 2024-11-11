import  User  from '../models/users.js';
import mongoose from 'mongoose'

class UserManager {
  // Crear un nuevo usuario
  async createUser(userData) {
    try {
      const newUser = new User(userData);
      await newUser.save();
      return newUser;
    } catch (error) {
      throw new Error('Error al crear un nuevo usuario: ' + error.message);
    }
  }
// Obtener todos los usuarios
async getAllUsers() {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        throw new Error('Error al obtener los usuarios: ' + error.message);
    }
}

  // Obtener un usuario por su ID
  async getUserById(userId) {
    try {
      const user = await User.findById(userId).populate('cart'); //Popular user a Cart
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      
      return user;
    } catch (error) {
      throw new Error(`Error al obtener el usuario con ID ${userId}: ${error.message}`);
    }
  }

  // Obtener un usuario por su email
  async getUserByEmail(email) {
    try {
      // Buscar el usuario por email
      const user = await User.findOne({ email });
      return user || null; // Si no se encuentra el usuario, retornamos null
    } catch (error) {
      console.error(`Error al obtener el usuario con email ${email}: ${error.message}`);
      return null; // Devolvemos null si hay un error
    }
  }
  // Actualizar los datos de un usuario
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

  // Eliminar un usuario por su ID
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
  
  // Actualizar el rol del usuario
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

export default UserManager;
