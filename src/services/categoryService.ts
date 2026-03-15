import Category from '../models/Category';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class CategoryService {
    async getAllCategories(filters: { page?: number; limit?: number } = {}) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;

        try {
            const { count, rows } = await Category.findAndCountAll({
                where: { isActive: true },
                limit,
                offset,
                order: [['sortOrder', 'ASC']]
            });

            return {
                categories: rows,
                totalCount: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            };
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getCategoryByHandle(handle: string) {
        try {
            const category = await Category.findOne({
                where: { handle, isActive: true }
            });
            if (!category) {
                throw new CustomError('Category not found', constants.httpStatus.notFound);
            }
            return category;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async createCategory(categoryData: any) {
        try {
            const category = await Category.create(categoryData);
            return category.get({ plain: true });
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async updateCategory(handle: string, categoryData: any) {
        try {
            const category = await Category.findByPk(handle);
            if (!category) {
                throw new CustomError('Category not found', constants.httpStatus.notFound);
            }
            const updatedCategory = await category.update(categoryData);
            return updatedCategory.get({ plain: true });
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async deleteCategory(handle: string) {
        try {
            const category = await Category.findByPk(handle);
            if (!category) {
                throw new CustomError('Category not found', constants.httpStatus.notFound);
            }
            await category.update({ isActive: false });
            return { message: "Category deleted successfully" };
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }
}

export default new CategoryService();
