import { Request, Response } from 'express';
import bundleService from '../services/bundleService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class BundleController {
    async getAllBundles(req: Request, res: Response) {
        const result = new Result();
        try {
            const { page, limit } = req.query;
            const filters = {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            };
            const { bundles, totalCount, totalPages, currentPage } = await bundleService.getAllBundles(filters);
            result.data = bundles;
            result.message = "Bundles retrieved successfully";
            result.pagination = {
                totalCount,
                totalPages,
                currentPage,
                limit: filters.limit || 10
            };
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getAllBundles: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async getBundleById(req: Request, res: Response) {
        const result = new Result();
        try {
            const id: any = req.params.id;
            const data = await bundleService.getBundleById(id);
            result.data = data;
            result.message = "Bundle retrieved successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getBundleById: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async createBundle(req: Request, res: Response) {
        const result = new Result();
        try {
            const { sectionIds, ...bundleData } = req.body;
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };
            const data = await bundleService.createBundle({ ...bundleData, updatedBy }, sectionIds);
            result.data = data;
            result.status = constants.httpStatus.created;
            result.message = "Bundle created successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in createBundle: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async updateBundle(req: Request, res: Response) {
        const result = new Result();
        try {
            const id: any = req.params.id;
            const { sectionIds, ...bundleData } = req.body;
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };
            const data = await bundleService.updateBundle(id, { ...bundleData, updatedBy }, sectionIds);
            result.data = data;
            result.message = "Bundle updated successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in updateBundle: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async deleteBundle(req: Request, res: Response) {
        const result = new Result();
        try {
            const id: any = req.params.id;
            const data = await bundleService.deleteBundle(id);
            result.data = data;
            result.message = "Bundle deleted successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in deleteBundle: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }
}

export default new BundleController();
