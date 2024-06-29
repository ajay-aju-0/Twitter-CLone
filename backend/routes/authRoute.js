import express from 'express';
import { getMe, loginController, logoutController, signUpController } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/protectRoute.js';

const router = express.Router();

router.get('/me', protectRoute, getMe)

router.post('/signup', signUpController);

router.post('/login', loginController);

router.post('/logout', logoutController);

export default router;
