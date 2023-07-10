import { IFailure } from "@APP/api/types";

/**
 * application failure class
 */
export class Failure extends Error {
    override readonly name: "Failure";
    override readonly cause: string;
    override readonly message: string;
    public readonly statusCode: number;
    constructor({
        cause,
        message,
        statusCode,
    }: {
        cause: string;
        message: string;
        statusCode: number;
    }) {
        super();
        this.name = "Failure";
        this.cause = cause;
        this.message = message;
        this.statusCode = statusCode;
    }

    getCause() {
        return this.cause;
    }

    getMessage() {
        return this.message;
    }

    getStatusCode() {
        return this.statusCode;
    }

    getFailure(): IFailure {
        return { cause: this.cause, message: this.message };
    }
}
