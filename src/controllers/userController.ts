import { Request, Response } from 'express';
import userService from '../services/userService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class UserController {
    async getMe(req: Request, res: Response) {
        const result = new Result();
        try {
            const userId = (req as any).user.id;
            const data = await userService.getUserById(userId);
            result.data = data;
            result.message = "User profile retrieved successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getMe: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async updateMe(req: any, res: Response) {
        const result = new Result();
        try {
            const userId = req.user.id;
            const data = await userService.updateUser(userId, req.body);
            result.data = data;
            result.message = "User profile updated successfully";
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in updateMe: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async getAllUsers(req: Request, res: Response) {
        const result = new Result();
        try {
            const { page, limit } = req.query;
            const filters = {
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            };
            const { users, totalCount, totalPages, currentPage } = await userService.getAllUsers(filters);
            result.data = users;
            result.message = "Users retrieved successfully";
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
            logger.error(reqId, `Error in getAllUsers: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }
}

export default new UserController();
