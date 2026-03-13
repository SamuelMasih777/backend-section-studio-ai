import Category from '../models/Category';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class CategoryService {
    async getAllCategories() {
        try {
            const categories = await Category.findAll({
                where: { isActive: true },
                order: [['sortOrder', 'ASC']]
            });
            return categories;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getCategoryByHandle(handle: string) {
        try {
            const category = await Category.findByPk(handle);
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
            return category;
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
            await category.update(categoryData);
            return category;
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
            await category.destroy();
            return { message: "Category deleted successfully" };
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }
}

export default new CategoryService();
