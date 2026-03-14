import { Section, Category, Tag, Bundle, Purchase } from '../models';
import { Op, fn, col, literal } from 'sequelize';
import CustomError from '../models/CustomError';
import constants from '../models/constants';

class StatsService {
    // 1. Core Endpoints
    async getSummary() {
        try {
            const [totalSections, totalCategories, totalTags, totalBundles] = await Promise.all([
                Section.count(),
                Category.count(),
                Tag.count(),
                Bundle.count()
            ]);

            return {
                totalSections,
                totalCategories,
                totalTags,
                totalBundles
            };
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getRecentSections(limit: number = 5) {
        try {
            const sections = await Section.findAll({
                order: [['updatedAt', 'DESC']],
                limit: limit,
                attributes: ['id', 'title', 'handle', 'category', 'isPublished', 'updatedAt']
            });
            return sections;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getTopCategories(limit: number = 5) {
        try {
            const categories = await Section.findAll({
                attributes: [
                    'category',
                    [fn('COUNT', col('id')), 'sectionCount']
                ],
                group: ['category'],
                order: [[literal('\"sectionCount\"'), 'DESC']],
                limit: limit
            });
            return categories;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    // 2. Revenue & Purchase Endpoints
    async getRevenueSummary() {
        try {
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            const [totalRevenue, monthlyRevenue, totalPurchases] = await Promise.all([
                Purchase.sum('amount', { where: { status: 'active' } }),
                Purchase.sum('amount', { 
                    where: { 
                        status: 'active',
                        createdAt: { [Op.gte]: firstDayOfMonth }
                    } 
                }),
                Purchase.count({ where: { status: 'active' } })
            ]);

            return {
                totalRevenue: totalRevenue || 0,
                monthlyRevenue: monthlyRevenue || 0,
                totalPurchases
            };
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getTopPurchased(limit: number = 5) {
        try {
            // Top purchased sections
            const topSections = await Purchase.findAll({
                attributes: [
                    'sectionId',
                    [fn('COUNT', col('id')), 'purchaseCount'],
                    [fn('SUM', col('amount')), 'totalRevenue']
                ],
                where: { sectionId: { [Op.not]: null }, status: 'active' },
                group: ['sectionId'],
                order: [[literal('\"purchaseCount\"'), 'DESC']],
                limit: limit,
                include: [{ model: Section, attributes: ['title'] }]
            });

            // Top purchased bundles
            const topBundles = await Purchase.findAll({
                attributes: [
                    'bundleId',
                    [fn('COUNT', col('id')), 'purchaseCount'],
                    [fn('SUM', col('amount')), 'totalRevenue']
                ],
                where: { bundleId: { [Op.not]: null }, status: 'active' },
                group: ['bundleId'],
                order: [[literal('\"purchaseCount\"'), 'DESC']],
                limit: limit,
                include: [{ model: Bundle, attributes: ['title'] }]
            });

            return {
                sections: topSections,
                bundles: topBundles
            };
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    // 3. Additional Endpoints
    async getContentGrowth() {
        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            // Grouping by date string manually or using DB specific functions.
            // Using a simpler approach compatible cross-db for counting per day:
            const items = await Section.findAll({
                attributes: [
                    [fn('DATE', col('createdAt')), 'date'],
                    [fn('COUNT', col('id')), 'count']
                ],
                where: {
                    createdAt: {
                        [Op.gte]: thirtyDaysAgo
                    }
                },
                group: [fn('DATE', col('createdAt'))],
                order: [[fn('DATE', col('createdAt')), 'ASC']]
            });
            return items;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }

    async getPopularTags(limit: number = 10) {
        try {
            // Assuming tags are an array of strings in the Section model.
            // Sequelize doesn't natively group by array elements easily across all dialects without specific raw queries.
            // We'll fetch all tags from active sections and count them in memory, which is fine for moderate datasets.
            const sections = await Section.findAll({ attributes: ['tags'] });
            
            const tagCounts: { [key: string]: number } = {};
            sections.forEach(section => {
                if (section.tags && Array.isArray(section.tags)) {
                    section.tags.forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                    });
                }
            });

            const sortedTags = Object.entries(tagCounts)
                .map(([tag, count]) => ({ tag, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, limit);

            return sortedTags;
        } catch (error: any) {
            throw new CustomError(error.message, constants.httpStatus.serverError);
        }
    }
}

export default new StatsService();
