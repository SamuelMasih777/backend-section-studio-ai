import { Request, Response } from 'express';
import sectionService from '../services/sectionService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class SectionController {
    async getAllSections(req: Request, res: Response) {
        const result = new Result();
        try {
            const { category, search, publishStatus, page, limit } = req.query;
            const filters = {
                category: category as string,
                search: search as string,
                publishStatus: publishStatus === 'true' ? true : publishStatus === 'false' ? false : undefined,
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            };
            const { sections, totalCount, totalPages, currentPage } = await sectionService.getAllSections(filters);
            result.data = sections;
            result.message = "Sections retrieved successfully";
            result.pagination = {
                totalCount,
                totalPages,
                currentPage,
                limit: filters.limit || 10
            };
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
            result.message = "Section retrieved successfully";
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
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };
            const data = await sectionService.createSection({ ...req.body, updatedBy });
            result.data = data;
            result.status = constants.httpStatus.created;
            result.message = "Section created successfully";
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
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };
            const data = await sectionService.updateSection(id, { ...req.body, updatedBy });
            result.data = data;
            result.status = constants.httpStatus.success;
            result.message = "Section updated successfully";
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
            result.message = "Section deleted successfully";
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
