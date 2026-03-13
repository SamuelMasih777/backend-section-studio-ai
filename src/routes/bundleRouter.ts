import { Router } from 'express';
import bundleController from '../controllers/bundleController';
import auth from '../middlewares/authMiddleware';
import config from '../models/config';

const router = Router();
const roles = config.roles;

router.get('/', auth([roles.admin, roles.user]), bundleController.getAllBundles);
router.get('/:id', auth([roles.admin, roles.user]), bundleController.getBundleById);
router.post('/', auth([roles.admin]), bundleController.createBundle);
router.put('/:id', auth([roles.admin]), bundleController.updateBundle);
router.delete('/:id', auth([roles.admin]), bundleController.deleteBundle);

export default router;
