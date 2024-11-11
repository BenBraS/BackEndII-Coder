import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserManager from '../managers/UserManager.js'; 
import passport from 'passport';
//CONFIG COOKIES
export const COOKIE_NAME = 'token';  

export const COOKIE_OPTIONS = {
  httpOnly: true,  // Asegura que la cookie no pueda ser accedida por JavaScript en el navegador
  secure: process.env.NODE_ENV === 'production',  // Solo en producción, usar cookies seguras (HTTPS)
  maxAge: 3600000,  // La cookie expirará en 1 hora
};


const userManager = new UserManager();

export default function passportConfig() {
  const opts = {
    // Extrae el JWT desde las cookies
    jwtFromRequest: ExtractJwt.fromExtractors([
      (req) => req.cookies[COOKIE_NAME], // Obtener el token de la cookie
    ]),
    secretOrKey: process.env.JWT_SECRET, 
  };

  // Estrategia JWT
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await userManager.getUserById(jwt_payload.userId); // payload contiene un userId
        if (!user) {
          return done(null, false);  // No se encontró el usuario
        }
        return done(null, user);  // Usuario encontrado
      } catch (err) {
        return done(err, false);  // Error al verificar el usuario
      }
    })
  );

  // Estrategia "current" para obtener los datos del usuario autenticado
  passport.use(
    'current',
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        console.log("JWT Payload:", jwt_payload);  // log para verificar el contenido del JWT
        const user = await userManager.getUserById(jwt_payload.userId);
        if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' });
        }
        return done(null, user);  // Devuelve el usuario asociado al JWT
      } catch (err) {
        return done(err, false, { message: 'Error en la autenticación' });
      }
    })
  );
}