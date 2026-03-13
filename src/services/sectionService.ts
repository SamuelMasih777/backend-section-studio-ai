import { Op } from 'sequelize';
import Section from '../models/Section';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class SectionService {
    async getAllSections(filters: { category?: string; search?: string; publishStatus?: boolean } = {}) {
        const where: any = {};

        if (filters.category) {
            where.category = filters.category;
        }

        if (filters.search) {
            where[Op.or] = [
                { title: { [Op.iLike]: `%${filters.search}%` } },
                { handle: { [Op.iLike]: `%${filters.search}%` } }
            ];
        }

        if (filters.publishStatus !== undefined) {
            where.isPublished = filters.publishStatus;
        }

        try {
            const sections = await Section.findAll({ where });
            return sections;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getSectionById(id: string) {
        try {
            const section = await Section.findByPk(id);
            if (!section) {
                throw new CustomError('Section not found', constants.httpStatus.notFound);
            }
            return section;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async createSection(sectionData: any) {
        try {
            const section = await Section.create(sectionData);
            return section;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async updateSection(id: string, sectionData: any) {
        try {
            const section = await Section.findByPk(id);
            if (!section) {
                throw new CustomError('Section not found', constants.httpStatus.notFound);
            }
            await section.update(sectionData);
            return section;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async deleteSection(id: string) {
        try {
            const section = await Section.findByPk(id);
            if (!section) {
                throw new CustomError('Section not found', constants.httpStatus.notFound);
            }
            await section.destroy();
            return { message: "Section deleted successfully" };
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }
}

export default new SectionService();
