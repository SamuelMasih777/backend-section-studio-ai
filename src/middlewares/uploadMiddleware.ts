import multer, { memoryStorage } from 'multer';
import { Request, Response, NextFunction } from 'express';
import constants from '../models/constants';

const processFile = multer({
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
        cb(null, true);
    },
}).fields([
    { name: "video", maxCount: 1 },
    { name: "imageFiles", maxCount: 3 },
    { name: "media", maxCount: 6 },
    { name: "liquidFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
    { name: "previewImages", maxCount: 10 }
    // Add more fields as needed based on user requirements
]);

const handleFileUpload = (req: Request, res: Response, next: NextFunction) => {
    processFile(req, res, (err: any) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({ message: "File is too large" });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(500).json({ message: "File upload failed" });
        }

        const files = req.files as { [fieldname: string]: Express.Multer.File[] };
        const allFiles = Object.values(files || {}).flat();

        for (const file of allFiles) {
            const isLargeFile = constants.largeFileMimeTypePrefixes.some(prefix =>
                file.mimetype.startsWith(prefix)
            );
            
            const maxSize = isLargeFile
                ? constants.maxVideoFileUploadSize
                : constants.maxFileUploadSize;

            if (file.size > maxSize) {
                return res.status(400).json({ message: `File ${file.originalname} is too large` });
            }
        }
        next();
    });
};

export default handleFileUpload;
