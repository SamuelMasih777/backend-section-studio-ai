import { Router } from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';
import auth from '../middlewares/authMiddleware';
import config from '../models/config';

const router = Router();
const roles = config.roles;

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/me', auth([roles.admin, roles.superAdmin, roles.user]), userController.getMe);
router.patch('/profile', auth([roles.admin, roles.superAdmin, roles.user]), userController.updateMe);

export default router;
