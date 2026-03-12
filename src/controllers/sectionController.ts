import { Request, Response } from 'express';
import sectionService from '../services/sectionService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class SectionController {
    async getAllSections(req: Request, res: Response) {
        const result = new Result();
        try {
            const data = await sectionService.getAllSections();
            result.data = data;
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getAllSections: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async getSectionById(req: Request, res: Response) {
        const result = new Result();
        try {
            const id: any = req.params.id;
            const data = await sectionService.getSectionById(id);
            result.data = data;
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getSectionById: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async createSection(req: Request, res: Response) {
        const result = new Result();
        try {
            const data = await sectionService.createSection(req.body);
            result.data = data;
            result.status = constants.httpStatus.created;
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in createSection: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async updateSection(req: Request, res: Response) {
        const result = new Result();
        try {
            const id: any = req.params.id;
            const data = await sectionService.updateSection(id, req.body);
            result.data = data;
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in updateSection: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async deleteSection(req: Request, res: Response) {
        const result = new Result();
        try {
            const id: any = req.params.id;
            const data = await sectionService.deleteSection(id);
            result.data = data;
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in deleteSection: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }
}

export default new SectionController();
