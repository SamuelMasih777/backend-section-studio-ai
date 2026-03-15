import { Router } from 'express';
import sectionController from '../controllers/sectionController';
import auth from '../middlewares/authMiddleware';
import handleFileUpload from '../middlewares/uploadMiddleware';
import config from '../models/config';

const router = Router();
const roles = config.roles;

router.get('/', auth([roles.admin, roles.user]), sectionController.getAllSections);
router.get('/:id', auth([roles.admin, roles.user]), sectionController.getSectionById);
router.post('/', auth([roles.admin]), handleFileUpload, sectionController.createSection);
router.put('/:id', auth([roles.admin]), handleFileUpload, sectionController.updateSection);
router.delete('/:id', auth([roles.admin]), sectionController.deleteSection);

export default router;
