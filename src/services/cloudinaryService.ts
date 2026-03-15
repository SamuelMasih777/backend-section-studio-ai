import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = (file: Express.Multer.File, folder: string = 'sections'): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        // Determine resource type based on mimetype
        let resourceType: 'auto' | 'raw' | 'image' | 'video' = 'auto';
        
        // .liquid files come as octet-stream or text sometimes, treat as 'raw'
        if (file.originalname && file.originalname.endsWith('.liquid')) {
            resourceType = 'raw';
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: resourceType,
                public_id: `${Date.now()}_${file.originalname}`
            },
            (error, result) => {
                if (error) return reject(error);
                if (result) return resolve(result);
                reject(new Error('Unknown Cloudinary upload error'));
            }
        );

        // Convert buffer to stream and pipe to cloudinary
        const readableStream = new Readable();
        readableStream._read = () => {}; // required for Readable
        readableStream.push(file.buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
};

export default {
    uploadToCloudinary
};
