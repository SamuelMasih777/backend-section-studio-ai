import { Bundle, BundleItem, Section } from '../models';
import { literal } from 'sequelize';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class BundleService {
    async getAllBundles(filters: { page?: number; limit?: number } = {}) {
        const page = filters.page || 1;
        const limit = filters.limit || 10;
        const offset = (page - 1) * limit;

        try {
            const { count, rows } = await Bundle.findAndCountAll({
                where: { isActive: true },
                limit,
                offset,
                order: [['createdAt', 'DESC']],
                attributes: {
                    include: [
                        [
                            literal(`(
                                SELECT COALESCE(array_agg("sectionId")::text[], ARRAY[]::text[])
                                FROM "BundleItem"
                                INNER JOIN "Section" ON "Section"."id" = "BundleItem"."sectionId"
                                WHERE "BundleItem"."bundleId" = "Bundle"."id" AND "Section"."isActive" = true
                            )`),
                            'sectionIds'
                        ]
                    ]
                }
            });

            return {
                bundles: rows,
                totalCount: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            };
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getBundleById(id: string) {
        try {
            const bundle = await Bundle.findOne({
                where: { id, isActive: true },
                attributes: {
                    include: [
                        [
                            literal(`(
                                SELECT COALESCE(array_agg("sectionId")::text[], ARRAY[]::text[])
                                FROM "BundleItem"
                                INNER JOIN "Section" ON "Section"."id" = "BundleItem"."sectionId"
                                WHERE "BundleItem"."bundleId" = "Bundle"."id" AND "Section"."isActive" = true
                            )`),
                            'sectionIds'
                        ]
                    ]
                }
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

    async updateBundle(id: string, bundleData: any, sectionIds?: string[]) {
        try {
            const bundle = await Bundle.findByPk(id);
            if (!bundle) {
                throw new CustomError('Bundle not found', constants.httpStatus.notFound);
            }
            await bundle.update(bundleData);

            if (sectionIds !== undefined) {
                let parsedSectionIds: string[] = [];
                // Handle case where sectionIds might be a JSON string from form-data
                if (typeof sectionIds === 'string') {
                    try {
                        parsedSectionIds = JSON.parse(sectionIds);
                    } catch (e) {
                        parsedSectionIds = [sectionIds];
                    }
                } else if (Array.isArray(sectionIds)) {
                    parsedSectionIds = sectionIds;
                }

                const existingItems = await BundleItem.findAll({ where: { bundleId: id } });
                const existingSectionIds = existingItems.map(item => item.sectionId);

                const toAdd = parsedSectionIds.filter(sid => !existingSectionIds.includes(sid));
                const toRemove = existingSectionIds.filter(sid => !parsedSectionIds.includes(sid));

                if (toRemove.length > 0) {
                    await BundleItem.destroy({ 
                        where: { 
                            bundleId: id, 
                            sectionId: toRemove 
                        } 
                    });
                }

                if (toAdd.length > 0) {
                    const bundleItems = toAdd.map(sectionId => ({
                        bundleId: id,
                        sectionId: sectionId
                    }));
                    await BundleItem.bulkCreate(bundleItems);
                }
            }

            return this.getBundleById(id);
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
            await bundle.update({ isActive: false });
            return { message: "Bundle deleted successfully" };
        } catch (error: any) {
            if (error instanceof CustomError) throw error;
            throw new CustomError(error.message, constants.httpStatus.badRequest);
        }
    }
}

export default new BundleService();
