import { Request, Response } from 'express';
import tagService from '../services/tagService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class TagController {
    async getAllTags(req: Request, res: Response) {
        const result = new Result();
        try {
            const { page, limit } = req.query;
            const filters = {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            };
            const { tags, totalCount, totalPages, currentPage } = await tagService.getAllTags(filters);
            result.data = tags;
            result.message = "Tags retrieved successfully";
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
            logger.error(reqId, `Error in getAllTags: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async getTagByHandle(req: Request, res: Response) {
        const result = new Result();
        try {
            const handle: any = req.params.handle;
            const data = await tagService.getTagByHandle(handle);
            result.data = data;
            result.message = "Tag retrieved successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getTagByHandle: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async createTag(req: Request, res: Response) {
        const result = new Result();
        try {
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };
            const data = await tagService.createTag({ ...req.body, updatedBy });
            result.data = data;
            result.status = constants.httpStatus.created;
            result.message = "Tag created successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in createTag: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async updateTag(req: Request, res: Response) {
        const result = new Result();
        try {
            const handle: any = req.params.handle;
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };
            const data = await tagService.updateTag(handle, { ...req.body, updatedBy });
            result.data = data;
            result.message = "Tag updated successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in updateTag: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async deleteTag(req: Request, res: Response) {
        const result = new Result();
        try {
            const handle: any = req.params.handle;
            const data = await tagService.deleteTag(handle);
            result.data = data;
            result.message = "Tag deleted successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in deleteTag: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }
}

export default new TagController();
