import { Router } from 'express';
import userController from '../controllers/userController';
import auth from '../middlewares/authMiddleware';
import config from '../models/config';

const router = Router();
const roles = config.roles;

router.get('/', auth([roles.admin, roles.superAdmin]), userController.getAllUsers);

export default router;
