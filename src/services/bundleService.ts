import { Bundle, BundleItem, Section } from '../models';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class BundleService {
    async getAllBundles() {
        try {
            const bundles = await Bundle.findAll({
                where: { isActive: true }
            });
            return bundles;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getBundleById(id: string) {
        try {
            const bundle = await Bundle.findByPk(id, {
                include: [{
                    model: BundleItem,
                    as: 'items',
                    include: [{
                        model: Section,
                        as: 'section'
                    }]
                }]
            });
            if (!bundle) {
                throw new CustomError('Bundle not found', constants.httpStatus.notFound);
            }
            return bundle;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async createBundle(bundleData: any, sectionIds: string[]) {
        try {
            const bundle = await Bundle.create(bundleData);

            if (sectionIds && sectionIds.length > 0) {
                const bundleItems = sectionIds.map(sectionId => ({
                    bundleId: bundle.id,
                    sectionId: sectionId
                }));
                await BundleItem.bulkCreate(bundleItems);
            }

            return bundle;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async updateBundle(id: string, bundleData: any) {
        try {
            const bundle = await Bundle.findByPk(id);
            if (!bundle) {
                throw new CustomError('Bundle not found', constants.httpStatus.notFound);
            }
            await bundle.update(bundleData);
            return bundle;
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }

    async deleteBundle(id: string) {
        try {
            const bundle = await Bundle.findByPk(id);
            if (!bundle) {
                throw new CustomError('Bundle not found', constants.httpStatus.notFound);
            }
            await bundle.destroy();
            return { message: "Bundle deleted successfully" };
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }
}

export default new BundleService();
