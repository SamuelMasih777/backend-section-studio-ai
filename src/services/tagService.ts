import Tag from '../models/Tag';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class TagService {
    async getAllTags() {
        try {
            const tags = await Tag.findAll({
                where: { isActive: true },
                order: [['sortOrder', 'ASC']]
            });
            return tags;
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
