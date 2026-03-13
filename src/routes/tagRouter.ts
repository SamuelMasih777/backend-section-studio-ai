import { Router } from 'express';
import tagController from '../controllers/tagController';
import auth from '../middlewares/authMiddleware';
import config from '../models/config';

const router = Router();
const roles = config.roles;

router.get('/', auth([roles.admin, roles.user]), tagController.getAllTags);
router.get('/:handle', auth([roles.admin, roles.user]), tagController.getTagByHandle);
router.post('/', auth([roles.admin]), tagController.createTag);
router.put('/:handle', auth([roles.admin]), tagController.updateTag);
router.delete('/:handle', auth([roles.admin]), tagController.deleteTag);

export default router;
