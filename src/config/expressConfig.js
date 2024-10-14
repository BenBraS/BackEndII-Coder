import 'dotenv/config'
import handlebars from 'express-handlebars';
import productsRouter from '../routes/products.router.js';
import views from '../routes/views.js';
import cartsRouter from '../routes/carts.router.js';
import express from 'express'
import mongoose from 'mongoose';



const uriDB = process.env.MONGODB_URI;

export default function expressConfig(app, __dirname) {
   // Conexión a Mongo Atlas
 
  
  const connectMongoDb = async() =>{
    try {
      await mongoose.connect(uriDB)
      console.log("Conectado con exito a la base usando Mongoose")
    } catch (error) {
      console.error("No se pudo conectar a la base:" + error)
      process.exit()
      
    }
  }
  
  connectMongoDb();

  // CONFIGURACIONES HANDLEBARS
// Definir el helper eq
const hbs = handlebars.create({
  runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true
  },
  helpers: {
      eq: (value1, value2) => value1 === value2 
  }
});

// Configuración de Handlebars
app.engine('handlebars', hbs.engine);
app.set('views', __dirname + '/views/');
app.set('view engine', 'handlebars');
  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Configuración para archivos públicos
  app.use(express.static(__dirname + '/public/'));

  // Routers
  app.use('/api/products', productsRouter);
  app.use('/api/carts', cartsRouter);

  // Vistas
  app.use('/', views);
}