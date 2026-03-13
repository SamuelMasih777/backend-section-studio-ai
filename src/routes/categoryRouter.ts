import { Router } from 'express';
import categoryController from '../controllers/categoryController';
import auth from '../middlewares/authMiddleware';
import config from '../models/config';

const router = Router();
const roles = config.roles;

router.get('/', auth([roles.admin, roles.user]), categoryController.getAllCategories);
router.get('/:handle', auth([roles.admin, roles.user]), categoryController.getCategoryByHandle);
router.post('/', auth([roles.admin]), categoryController.createCategory);
router.put('/:handle', auth([roles.admin]), categoryController.updateCategory);
router.delete('/:handle', auth([roles.admin]), categoryController.deleteCategory);

export default router;
