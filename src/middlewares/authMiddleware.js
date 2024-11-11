// middlewares/authMiddleware.js
export function authorizeRole(roles) {
    return (req, res, next) => {
      const { role } = req.user; // `req.user` debe estar configurado por Passport
      
      if (roles.includes(role)) {
        return next();
      }
      
      return res.status(403).json({ message: 'Acceso denegado' });
    };
  }