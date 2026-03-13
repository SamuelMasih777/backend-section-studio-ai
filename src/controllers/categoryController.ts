import { Request, Response } from 'express';
import categoryService from '../services/categoryService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class CategoryController {
    async getAllCategories(req: Request, res: Response) {
        const result = new Result();
        try {
            const data = await categoryService.getAllCategories();
            result.data = data;
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
            const data = await categoryService.createCategory(req.body);
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
            const data = await categoryService.updateCategory(handle, req.body);
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
