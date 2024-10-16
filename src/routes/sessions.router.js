import express from 'express';
import UserManager from '../services/UserManager.js';
import CartManager from '../services/CartManager.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { COOKIE_NAME, COOKIE_OPTIONS } from '../config/passportConfig.js';
import passport from 'passport';
import { Router } from 'express';


const router = Router()
const userManager = new UserManager();
const cartManager = new CartManager();

// Ruta para mostrar la vista de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Endpoint /register: Crear un nuevo usuario y asociar carrito
// Endpoint /register: Crear un nuevo usuario y asociar carrito
router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        const existingUser = await userManager.getUserByEmail(email);
        if (existingUser) {
            return res.status(400).send({ message: 'El usuario ya existe' });
        }

        // Crear un carrito para el usuario
        const cart = await cartManager.createCart();
     
        // Crear un nuevo usuario
        const newUser = await userManager.createUser({
            first_name,
            last_name,
            email,
            age,
            password,  
            cart: cart._id,
        });

        // Crear el token JWT
        const payload = { userId: newUser._id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);

        // Establecer una cookie para el mensaje de éxito
        res.cookie('registrationSuccess', 'Usuario registrado exitosamente', {
            maxAge: 60000,  // La cookie expirará en 1 minuto
            httpOnly: true,
        });

        // Redirigir al usuario a la página de login
        res.redirect('/api/sessions/login');
        
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).send({ error: error.message });
    }
});



//vista login
router.get('/login', (req, res) => {
    // Verificar si existe la cookie 'registrationSuccess'
    const successMessage = req.cookies.registrationSuccess;

    // Renderizar la vista de login y pasar el mensaje de éxito si está presente
    res.render('login', { registrationSuccess: successMessage });

    // Eliminar la cookie después de mostrar el mensaje
    res.clearCookie('registrationSuccess');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Verificar si el usuario existe
      const user = await userManager.getUserByEmail(email);
    // Log para verificar si el usuario existe
  
      if (!user) {
        return res.status(400).send({ message: 'Credenciales incorrectas' });
      }
  
      // Asegurarnos de que la contraseña ingresada y el hash no tengan caracteres invisibles
      const passwordTrimmed = password.trim();
  
      // Comparar la contraseña con el hash almacenado
      const passwordMatch = await bcrypt.compare(passwordTrimmed, user.password);
  
      if (!passwordMatch) {
        return res.status(400).send({ message: 'Contraseña incorrecta' });
      }
  
      // Crear el token JWT
      const payload = { userId: user._id };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      // Establecer el token como cookie
      res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS);
  
      // Redirigir a /profile 
      return res.redirect('/api/sessions/profile');
  
    } catch (error) {
      console.error("Error en el login:", error);  // Log para ver el error exacto
      res.status(500).send({ error: error.message });
    }
  });
  
  
// Endpoint /logout: Cerrar sesión y eliminar el token
router.post('/logout', (req, res) => {
  try {
    // Eliminar la cookie que contiene el JWT
    res.clearCookie(COOKIE_NAME);

    res.status(200).send({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.render('profile', { first_name: req.user.first_name, last_name: req.user.last_name, email: req.user.email });
});



// Endpoint /current: Obtener los datos del usuario logueado (validar el JWT)
router.get('/current', passport.authenticate('current', { session: false }), async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send({ message: 'No estás autenticado' });
      }
      
      // Aquí, req.user debe contener el usuario autenticado
      const user = req.user;  // El usuario autenticado se obtiene de `req.user` gracias a Passport
      res.status(200).send({
        message: 'Usuario autenticado',
        user,
      });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });


export default router;
