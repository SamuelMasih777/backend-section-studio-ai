import { Request, Response } from 'express';
import tagService from '../services/tagService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class TagController {
    async getAllTags(req: Request, res: Response) {
        const result = new Result();
        try {
            const data = await tagService.getAllTags();
            result.data = data;
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
            const data = await tagService.createTag(req.body);
            result.data = data;
            result.status = constants.httpStatus.created;
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
            const data = await tagService.updateTag(handle, req.body);
            result.data = data;
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
