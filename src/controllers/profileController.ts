import { Request, Response } from 'express';
import profileService from '../services/profileService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class ProfileController {
    async getMe(req: Request, res: Response) {
        const result = new Result();
        try {
            const userId = (req as any).user.id; // From authMiddleware
            const data = await profileService.getProfileByUserId(userId);
            result.data = data;
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getMe: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async updateProfile(req: Request, res: Response) {
        const result = new Result();
        try {
            const userId = (req as any).user.id;
            const data = await profileService.updateProfile(userId, req.body);
            result.data = data;
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in updateProfile: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }
}

export default new ProfileController();
