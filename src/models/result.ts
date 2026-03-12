import constants from "./constants";

class Result {
    status: number;
    data: any;
    message: string;

    constructor() {
        this.status = constants.httpStatus.success;
        this.data = null;
        this.message = "";
    }
}

export default Result;
