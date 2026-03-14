import { User } from '../models';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class UserService {
    async getUserById(id: string) {
        try {
            const user = await User.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
            if (!user) {
                throw new CustomError('User not found', constants.httpStatus.notFound);
            }
            return user;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async updateUser(id: string, userData: any) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                throw new CustomError('User not found', constants.httpStatus.notFound);
            }
            // Prevent changing email/password/isSuperAdmin through this method usually
            delete userData.password;
            delete userData.email;
            delete userData.isSuperAdmin;
            
            await user.update(userData);
            return await User.findByPk(id, {
                attributes: { exclude: ['password'] }
            });
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async getAllUsers(filters: { page?: number; limit?: number } = {}) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;

        try {
            const { count, rows } = await User.findAndCountAll({
                attributes: { exclude: ['password'] },
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });
            
            return {
                users: rows,
                totalCount: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            };
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }
}

export default new UserService();
