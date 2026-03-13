import { Request, Response } from 'express';
import authService from '../services/authService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';

class AuthController {
    async signup(req: Request, res: Response) {
        const result = new Result();
        try {
            const data = await authService.signup(req.body);
            result.data = data;
            result.status = constants.httpStatus.created;
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in signup: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async login(req: Request, res: Response) {
        const result = new Result();
        try {
            const { email, password } = req.body;
            const data = await authService.login(email, password);
            result.data = data;
        } catch (error: any) {
            result.status = error.status || constants.httpStatus.unauthorized;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in login: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }
}

export default new AuthController();
