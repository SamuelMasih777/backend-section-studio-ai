import { Request, Response } from 'express';
import categoryService from '../services/categoryService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class CategoryController {
    async getAllCategories(req: Request, res: Response) {
        const result = new Result();
        try {
            const { page, limit } = req.query;
            const filters = {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            };
            const { categories, totalCount, totalPages, currentPage } = await categoryService.getAllCategories(filters);
            result.data = categories;
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
            logger.error(reqId, `Error in getAllCategories: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async getCategoryByHandle(req: Request, res: Response) {
        const result = new Result();
        try {
            const handle: any = req.params.handle;
            const data = await categoryService.getCategoryByHandle(handle);
            result.data = data;
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getCategoryByHandle: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async createCategory(req: Request, res: Response) {
        const result = new Result();
        try {
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };
            const data = await categoryService.createCategory({ ...req.body, updatedBy });
            result.data = data;
            result.status = constants.httpStatus.created;
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in createCategory: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async updateCategory(req: Request, res: Response) {
        const result = new Result();
        try {
            const handle: any = req.params.handle;
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };
            const data = await categoryService.updateCategory(handle, { ...req.body, updatedBy });
            result.data = data;
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in updateCategory: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async deleteCategory(req: Request, res: Response) {
        const result = new Result();
        try {
            const handle: any = req.params.handle;
            const data = await categoryService.deleteCategory(handle);
            result.data = data;
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in deleteCategory: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }
}

export default new CategoryController();
