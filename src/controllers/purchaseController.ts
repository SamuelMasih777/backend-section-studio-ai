import { Request, Response } from 'express';
import Purchase from '../models/Purchase';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class PurchaseController {
    
    // Called after Shopify redirects the merchant back to your app
    async savePurchase(req: Request, res: Response) {
        const result = new Result();
        try {
            // In a real app, you'd extract userId from the auth token/session
            // For Shopify, you might get the shop domain and map it to a user.
            const userId = (req as any).user?.id; // Assuming authMiddleware sets req.user

            const { charge_id, sectionId, bundleId, amount, currency } = req.body;

            if (!userId) {
                throw new Error("Unauthorized: User ID missing");
            }

            if (!charge_id || amount === undefined) {
                throw new Error("Missing required purchase details (charge_id, amount)");
            }

            // In production, you MUST verify the status of the charge_id with the Shopify API here
            // to ensure it was actually paid and not just a spoofed request.
            // Example: const chargeData = await shopify.billing.check(charge_id); 
            // if (chargeData.status !== 'active') throw new Error("Charge not active");

            const purchase = await Purchase.create({
                userId,
                chargeId: charge_id,
                sectionId: sectionId || null,
                bundleId: bundleId || null,
                amount,
                currency: currency || 'USD',
                status: 'active'
            });

            result.data = purchase;
            res.status(constants.httpStatus.created).json(result);

        } catch (error: any) {
            result.status = constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error saving purchase: ${error.message}`, {}, error);
            res.status(result.status).json(result);
        }
    }
}

export default new PurchaseController();
