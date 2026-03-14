import constants from "./constants";

class Result {
    status: number;
    data: any;
    message: string;
    pagination?: {
        totalCount: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    };

    constructor() {
        this.status = constants.httpStatus.success;
        this.data = null;
        this.message = "";
    }
}

export default Result;
