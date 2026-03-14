import Tag from '../models/Tag';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class TagService {
    async getAllTags(filters: { page?: number; limit?: number } = {}) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;

        try {
            const { count, rows } = await Tag.findAndCountAll({
                where: { isActive: true },
                limit,
                offset,
                order: [['sortOrder', 'ASC']]
            });
            
            return {
                tags: rows,
                totalCount: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            };
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getTagByHandle(handle: string) {
        try {
            const tag = await Tag.findByPk(handle);
            if (!tag) {
                throw new CustomError('Tag not found', constants.httpStatus.notFound);
            }
            return tag;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async createTag(tagData: any) {
        try {
            const tag = await Tag.create(tagData);
            return tag;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async updateTag(handle: string, tagData: any) {
        try {
            const tag = await Tag.findByPk(handle);
            if (!tag) {
                throw new CustomError('Tag not found', constants.httpStatus.notFound);
            }
            await tag.update(tagData);
            return tag;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async deleteTag(handle: string) {
        try {
            const tag = await Tag.findByPk(handle);
            if (!tag) {
                throw new CustomError('Tag not found', constants.httpStatus.notFound);
            }
            await tag.destroy();
            return { message: "Tag deleted successfully" };
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }
}

export default new TagService();
