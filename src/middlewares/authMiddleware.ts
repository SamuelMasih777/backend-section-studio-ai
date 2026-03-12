import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import constants from '../models/constants';
import config from '../models/config';

interface AuthRequest extends Request {
    user?: any;
}

const auth = (roles: string[] = []) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const { httpStatus } = constants;

        if (authHeader) {
            const token = authHeader.replace(/bearer /i, "");
            jwt.verify(token, config.jwtSecretKey, (err: any, decoded: any) => {
                if (err) {
                    return res.sendStatus(httpStatus.forbidden);
                }

                if (roles.length === 0 || roles.includes(decoded.role)) {
                    // Adapt user object to request
                    const user = decoded.user || decoded;
                    user.role = decoded.role;
                    req.user = user;
                    req.headers["userId"] = user.id;

                    // Placeholder for polygon/agency logic from user example
                    if (!req.headers.polygonid && (user.role === config.roles.admin || user.role === config.roles.driver)) {
                        req.headers.polygonid = user.polygonId || "fd656799-77c4-4e8f-8988-51089cdd42b6";
                    }

                    if (user.role === config.roles.admin && req.headers.polygonid) {
                        const agencyId = config.polygonAgencyId(req.headers.polygonid as string);
                        req.user.agencyId = agencyId;
                    }

                    return next();
                }
                return res.sendStatus(httpStatus.unauthorized);
            });
        } else {
            res.status(httpStatus.unauthorized).end();
        }
    };
};

export default auth;
