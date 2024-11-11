import { Router } from 'express';
import { renderHome, renderRealTimeProducts } from '../controllers/views.controller.js';
import { authorizeRole } from '../middlewares/authMiddleware.js';
import passport from 'passport';

const router = Router();

router.get('/', renderHome);
router.get('/realtimeproducts', passport.authenticate('jwt', { session: false }), authorizeRole(['admin']), renderRealTimeProducts);

export default router;
