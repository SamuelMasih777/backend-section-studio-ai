import { Request, Response } from 'express';
import sectionService from '../services/sectionService';
import Result from '../models/result';
import constants from '../models/constants';
import logger from '../services/common/logger';
import { uploadToCloudinary } from '../services/cloudinaryService';

class SectionController {
    async getAllSections(req: Request, res: Response) {
        const result = new Result();
        try {
            const { category, search, publishStatus, page, limit } = req.query;
            const filters = {
                category: category as string,
                search: search as string,
                publishStatus: publishStatus === 'true' ? true : publishStatus === 'false' ? false : undefined,
                page: page ? parseInt(page as string) : undefined,
                limit: limit ? parseInt(limit as string) : undefined
            };
            const { sections, totalCount, totalPages, currentPage } = await sectionService.getAllSections(filters);
            result.data = sections;
            result.message = "Sections retrieved successfully";
            result.pagination = {
                totalCount,
                totalPages,
                currentPage,
                limit: filters.limit || 10
            };
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getAllSections: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async getSectionById(req: Request, res: Response) {
        const result = new Result();
        try {
            const id: any = req.params.id;
            const data = await sectionService.getSectionById(id);
            result.data = data;
            result.message = "Section retrieved successfully";
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in getSectionById: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async createSection(req: Request, res: Response) {
        const result = new Result();
        try {
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };

            const sectionFilesData: any[] = [];
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            
            // Initialize media arrays in body if they don't exist
            req.body.previewImages = [];

            if (files) {
                const allFiles = Object.entries(files);
                for (const [fieldname, fileArray] of allFiles) {
                    for (const file of fileArray) {
                        const uploadResult = await uploadToCloudinary(file);
                        const secureUrl = uploadResult.secure_url;
                        
                        let fileType = 'unknown';
                        if (fieldname === 'liquidFile') {
                            fileType = 'liquid';
                        } else if (fieldname === 'video') {
                            fileType = 'video';
                            req.body.previewVideoUrl = secureUrl;
                        } else if (fieldname === 'thumbnail') {
                            fileType = 'image';
                            req.body.thumbnailUrl = secureUrl;
                        } else if (fieldname === 'previewImages' || fieldname === 'imageFiles' || fieldname === 'media') {
                            fileType = 'image';
                            req.body.previewImages.push(secureUrl);
                        }
                        
                        sectionFilesData.push({
                            filename: file.originalname,
                            fileType: fileType,
                            fileUrl: secureUrl,
                            fileSize: file.size,
                            sortOrder: sectionFilesData.length
                        });
                    }
                }
            }

            const data = await sectionService.createSection({ ...req.body, updatedBy }, sectionFilesData);
            result.data = data;
            result.status = constants.httpStatus.created;
            result.message = "Section created successfully";
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in createSection: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async updateSection(req: Request, res: Response) {
        const result = new Result();
        try {
            const id: any = req.params.id;
            const updatedBy = {
                name: (req as any).user.display_name,
                role: (req as any).user.role
            };

            const sectionFilesData: any[] = [];
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            
            // Note: For updates, we might want to preserve existing previewImages if not provided in files,
            // but usually a multipart update with files implies replacement for those fields.
            if (files && (files.previewImages || files.imageFiles || files.media)) {
                req.body.previewImages = [];
            }

            if (files) {
                const allFiles = Object.entries(files);
                for (const [fieldname, fileArray] of allFiles) {
                    for (const file of fileArray) {
                        const uploadResult = await uploadToCloudinary(file);
                        const secureUrl = uploadResult.secure_url;
                        
                        let fileType = 'unknown';
                        if (fieldname === 'liquidFile') {
                            fileType = 'liquid';
                        } else if (fieldname === 'video') {
                            fileType = 'video';
                            req.body.previewVideoUrl = secureUrl;
                        } else if (fieldname === 'thumbnail') {
                            fileType = 'image';
                            req.body.thumbnailUrl = secureUrl;
                        } else if (fieldname === 'previewImages' || fieldname === 'imageFiles' || fieldname === 'media') {
                            fileType = 'image';
                            if (!req.body.previewImages) req.body.previewImages = [];
                            req.body.previewImages.push(secureUrl);
                        }
                        
                        sectionFilesData.push({
                            filename: file.originalname,
                            fileType: fileType,
                            fileUrl: secureUrl,
                            fileSize: file.size,
                            sortOrder: sectionFilesData.length
                        });
                    }
                }
            }

            const data = await sectionService.updateSection(id, { ...req.body, updatedBy }, sectionFilesData);
            result.data = data;
            result.status = constants.httpStatus.success;
            result.message = "Section updated successfully";
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in updateSection: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }

    async deleteSection(req: Request, res: Response) {
        const result = new Result();
        try {
            const id: any = req.params.id;
            const data = await sectionService.deleteSection(id);
            result.data = data;
            result.message = "Section deleted successfully";
        } catch (error: any) {
            result.status = typeof error.status === 'number' ? error.status : constants.httpStatus.serverError;
            result.message = error.message;
            const reqId: any = req.headers['request-id'];
            logger.error(reqId, `Error in deleteSection: ${error.message}`, {}, error);
        }
        res.status(result.status).json(result);
    }
}

export default new SectionController();
