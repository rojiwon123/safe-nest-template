export class Failure<T extends string> extends Error {
    override readonly name: "InternalFailure";
    /**
     * @param message summary of error message
     * @param cause details of error message
     */
    constructor(
        override readonly message: T,
        override cause?: string,
    ) {
        super(message);
        this.name = "InternalFailure";
    }

    toHttp(status: number): Failure.Http {
        const http = new Failure.Http(status, this.message, this.cause);
        return http;
    }

    initCause() {
        this.cause = undefined;
    }
}

export namespace Failure {
    export class Http extends Error {
        override readonly name: "HttpFailure";
        override readonly message: string;
        constructor(
            readonly status: number,
            readonly response: string,
            internal_message?: string,
        ) {
            super();
            this.name = "HttpFailure";
            this.message = internal_message ?? response;
        }
    }
}
