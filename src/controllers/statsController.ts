import { Request, Response } from 'express';
import statsService from '../services/statsService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class StatsController {
    
    // Helper for controller methods
    private async handleRequest(req: Request, res: Response, serviceMethod: () => Promise<any>) {
        const result = new Result();
        try {
            const data = await serviceMethod();
            result.data = data;
            result.message = "Stats retrieved successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in stats endpoint: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    // 1. Core Endpoints
    async getSummary(req: Request, res: Response) {
        await this.handleRequest(req, res, () => statsService.getSummary());
    }

    async getRecentSections(req: Request, res: Response) {
        await this.handleRequest(req, res, () => statsService.getRecentSections());
    }

    async getTopCategories(req: Request, res: Response) {
        await this.handleRequest(req, res, () => statsService.getTopCategories());
    }

    // 2. Revenue & Purchase Endpoints
    async getRevenueSummary(req: Request, res: Response) {
        await this.handleRequest(req, res, () => statsService.getRevenueSummary());
    }

    async getTopPurchased(req: Request, res: Response) {
        await this.handleRequest(req, res, () => statsService.getTopPurchased());
    }

    // 3. Additional Endpoints
    async getContentGrowth(req: Request, res: Response) {
        await this.handleRequest(req, res, () => statsService.getContentGrowth());
    }

    async getPopularTags(req: Request, res: Response) {
        await this.handleRequest(req, res, () => statsService.getPopularTags());
    }
}

export default new StatsController();
