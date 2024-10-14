import mongoose from 'mongoose';

// Definir el esquema para los carritos (ahora llamado Carts)
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
      }
    }
  ]
});

// Crear el modelo de Mongoose con el nombre 'Carts' y la colección 'Carts'
const Cart = mongoose.model('Carts', cartSchema, 'carts');

export default Cart;
