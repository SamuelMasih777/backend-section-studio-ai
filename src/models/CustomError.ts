class CustomError extends Error {
    status: number;
    data: any;

    constructor(message: string = "", status: number = 500, data: any = null) {
        super(message);
        this.message = message;
        this.status = status;
        this.data = data;

        // Set the prototype explicitly
        Object.setPrototypeOf(this, CustomError.prototype);

        // Capture the stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }

        // Ensure name is properly set
        this.name = this.constructor.name;
    }

    [Symbol.for("nodejs.util.inspect.custom")]() {
        // Customize the stack to remove the "Error" keyword
        const stackWithoutError = this.stack?.replace(`${this.name}: `, "") || "";
        return `${this.message}\n${stackWithoutError}`;
    }
}

export default CustomError;
