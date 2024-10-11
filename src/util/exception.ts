export interface Exception<T extends string> {
    code: T;
    message?: string;
    detail?: unknown;
}
export namespace Exception {
    export class Http<Body extends Exception<string>> extends Error {
        override name = "HttpException";
        constructor(
            public readonly status: number,
            public readonly body: Body,
        ) {
            super(body.message ?? body.code);
        }

        static throw(status: number) {
            return <T extends string = string>(exception: Exception<T>): never => {
                throw new Http(status, exception);
            };
        }
    }

    export type API_NOT_FOUND = Exception<"API_NOT_FOUND">;
    export type INPUT_INVALID = Exception<"INPUT_INVALID">;
    export type INTERNAL_SERVER_ERROR = Exception<"INTERNAL_SERVER_ERROR">;

    export type Authentication = Authentication.Required | Authentication.Invalid | Authentication.Expired;
    export namespace Authentication {
        export type Required = Exception<"AUTHENTICATION_REQUIRED">;
        export type Invalid = Exception<"AUTHENTICATION_INVALID">;
        export type Expired = Exception<"AUTHENTICATION_EXPIRED">;
    }

    export namespace User {
        export type NotFound = Exception<"USER_NOT_FOUND">;
    }
}
