import { Op } from 'sequelize';
import Section from '../models/Section';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class SectionService {
    async getAllSections(filters: { category?: string; search?: string; publishStatus?: boolean; page?: number; limit?: number } = {}) {
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
        
        where.isActive = true;

        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;

        try {
            const { count, rows } = await Section.findAndCountAll({
                where,
                limit,
                offset,
                order: [['createdAt', 'DESC']]
            });

            return {
                sections: rows,
                totalCount: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            };
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getSectionById(id: string) {
        try {
            const section = await Section.findOne({
                where: { id, isActive: true }
            });
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
            return section.get({ plain: true });
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    private normalizeData(data: any) {
        const normalized = { ...data };
        
        // Handle tags sent as JSON string from multipart/form-data
        if (typeof normalized.tags === 'string') {
            try {
                normalized.tags = JSON.parse(normalized.tags);
            } catch (e) {
                // If not valid JSON, maybe it's a comma separated string?
                normalized.tags = normalized.tags.split(',').map((t: string) => t.trim());
            }
        }

        // Handle boolean casting from strings
        if (normalized.isFeatured === 'true') normalized.isFeatured = true;
        if (normalized.isFeatured === 'false') normalized.isFeatured = false;
        if (normalized.isPublished === 'true') normalized.isPublished = true;
        if (normalized.isPublished === 'false') normalized.isPublished = false;

        // Handle number casting from strings
        if (typeof normalized.price === 'string') normalized.price = parseFloat(normalized.price);
        if (typeof normalized.sortOrder === 'string') normalized.sortOrder = parseInt(normalized.sortOrder, 10);
        if (typeof normalized.presetsCount === 'string') normalized.presetsCount = parseInt(normalized.presetsCount, 10);
        if (typeof normalized.compareAtPrice === 'string') normalized.compareAtPrice = parseFloat(normalized.compareAtPrice);

        return normalized;
    }

    async updateSection(id: string, sectionData: any) {
        try {
            const section = await Section.findByPk(id);
            if (!section) {
                throw new CustomError('Section not found', constants.httpStatus.notFound);
            }
            
            const normalizedData = this.normalizeData(sectionData);
            const updatedSection = await section.update(normalizedData);
            return updatedSection.get({ plain: true });
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
            await section.update({ isActive: false });
            return { message: "Section deleted successfully" };
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }
}

export default new SectionService();
