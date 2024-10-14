// models.js
import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2'

// Productos Schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true },
  price: { type: Number, required: true, unique: true },
  stock: { type: Number, required: true },
  category: { type: String, required: true },
  thumbnails: { type: String, required: false},
  status: { 
    type: Boolean, 
    default: true,
  },
});

//  plugin 
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);

export default Product;


