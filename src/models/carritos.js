import mongoose from 'mongoose';

// Definir el esquema para los carritos (Carts)
const cartSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Relación con el modelo Producto
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      },
      createdAt: {
        type: Date, 
        default: Date.now
      }
    }
  ]
});

// Crear el modelo de Mongoose con el nombre 'Carts' y la colección 'carts'
const Cart = mongoose.model('Carts', cartSchema, 'carts');

export default Cart;
