import { Server } from 'socket.io';
import ProductManager from '../managers/ProductManager.js'; // Asegúrate de que la ruta sea correcta
import CartManager from '../managers/CartManager.js';

export default function socketConfig(httpServer) {
  const productManager = new ProductManager(); // Inicializa dentro de la función

  const socketServer = new Server(httpServer, {
    cors: {
      origin: '*', // Permitir todas las solicitudes de origen
      methods: ['GET', 'POST'],
    },
  });

  socketServer.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado');

    // Enviar la lista de productos actual a un nuevo cliente
    const products = await productManager.getAllProducts();
    socket.emit('updateProducts', { products, message: '' });

    // Evento de Producto Añadido
    socket.on('productAdded', async (product) => {
      try {
        await productManager.addProduct(product);
        const updatedProducts = await productManager.getAllProducts();
        socketServer.emit('updateProducts', { products: updatedProducts, message: 'Producto agregado exitosamente' });
      } catch (error) {
        socketServer.emit('updateProducts', { products: [], message: 'Error al agregar el producto' });
      }
    });
  
    // Evento de Producto Eliminado
    socket.on('productDeleted', async (Id) => {
      try {
        await productManager.deleteProduct(Id);
        const updatedProducts = await productManager.getAllProducts();
        socketServer.emit('updateProducts', { products: updatedProducts, message: 'Producto eliminado exitosamente' });
      } catch (error) {
        socketServer.emit('updateProducts', { products: [], message: 'Error al eliminar el producto' });
      }
    });
  });

  
}
