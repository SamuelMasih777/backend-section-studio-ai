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
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in updateMe: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }
}

export default new UserController();
