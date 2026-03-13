import Profile from '../models/Profile';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class ProfileService {
    async getProfileByUserId(userId: string) {
        try {
            const profile = await Profile.findByPk(userId);
            if (!profile) {
                throw new CustomError('Profile not found', constants.httpStatus.notFound);
            }
            return profile;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async updateProfile(userId: string, profileData: any) {
        try {
            const profile = await Profile.findByPk(userId);
            if (!profile) {
                throw new CustomError('Profile not found', constants.httpStatus.notFound);
            }
            await profile.update(profileData);
            return profile;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async createProfile(profileData: any) {
        try {
            const profile = await Profile.create(profileData);
            return profile;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }
}

export default new ProfileService();
