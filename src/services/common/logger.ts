const logger = {
    info: (requestId: any, message: string, data: any = {}) => {
        console.log(`[INFO] [${requestId || 'N/A'}] ${message}`, data);
    },
    error: (requestId: any, message: string, data: any = {}, error: any = null) => {
        console.error(`[ERROR] [${requestId || 'N/A'}] ${message}`, data, error);
    },
    warn: (requestId: any, message: string, data: any = {}) => {
        console.warn(`[WARN] [${requestId || 'N/A'}] ${message}`, data);
    }
};

export default logger;
