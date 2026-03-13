import { Router } from 'express';
import profileController from '../controllers/profileController';
import auth from '../middlewares/authMiddleware';
import config from '../models/config';

const router = Router();
const roles = config.roles;

router.get('/me', auth([roles.admin, roles.user]), profileController.getMe);
router.patch('/profile', auth([roles.admin, roles.user]), profileController.updateProfile);

export default router;
