import { Router } from 'express';
import statsController from '../controllers/statsController';
import auth from '../middlewares/authMiddleware';
import config from '../models/config';

import purchaseController from '../controllers/purchaseController';

const router = Router();
const roles = config.roles;

// Require admin or superAdmin for all stats endpoints
const requireAdmin = auth([roles.admin, roles.superAdmin]);
// Require regular user auth to save a purchase they just made
const requireUser = auth([roles.user, roles.admin, roles.superAdmin]);

// 1. Core Endpoints
router.get('/summary', requireAdmin, (req, res) => statsController.getSummary(req, res));
router.get('/recent-sections', requireAdmin, (req, res) => statsController.getRecentSections(req, res));
router.get('/top-categories', requireAdmin, (req, res) => statsController.getTopCategories(req, res));

// 2. Revenue & Purchase Endpoints
router.get('/revenue-summary', requireAdmin, (req, res) => statsController.getRevenueSummary(req, res));
router.get('/top-purchased', requireAdmin, (req, res) => statsController.getTopPurchased(req, res));

// 3. Additional Endpoints
router.get('/content-growth', requireAdmin, (req, res) => statsController.getContentGrowth(req, res));
router.get('/popular-tags', requireAdmin, (req, res) => statsController.getPopularTags(req, res));

// 4. Save Purchase Callback
// Called by your frontend after Shopify redirects back from a successful ApplicationCharge approval
router.post('/purchase', requireUser, (req, res) => purchaseController.savePurchase(req, res));

export default router;
