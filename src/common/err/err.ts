export class Err<Body extends Err.Body<string>> extends Error {
    constructor(
        readonly body: Body,
        ...cause: Error[]
    ) {
        super(body.code);
        if (cause.length > 0) super.cause = cause;
    }

    toHttp(status: number): Err.Http {
        return new Err.Http(status, this.body);
    }
}

export namespace Err {
    export interface Body<T extends string> {
        readonly code: T;
        readonly message?: string;
    }
    export class Http extends Error {
        override name = "HttpError" as const;
        constructor(
            readonly status: number,
            public readonly body: Body<string>,
        ) {
            super(body.message);
        }
    }
}
