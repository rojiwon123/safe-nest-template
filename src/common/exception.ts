import * as nest from '@nestjs/common';

export class Exception<
    T extends Exception.IBody<string>,
> extends nest.HttpException {
    constructor(
        public readonly body: T,
        status: number,
    ) {
        super(body.message ?? body.code, status);
        this.body = body;
    }
}

export namespace Exception {
    export interface IBody<T extends string> {
        readonly code: T;
        readonly message?: string | undefined;
    }
    export namespace Permission {
        export type Required = IBody<'PERMISSION_REQUIRED'>;
        export type Invalid = IBody<'PERMISSION_INVALID'>;
        export type Expired = IBody<'PERMISSION_EXPIRED'>;
    }
    export namespace User {
        export type NotFound = IBody<'USER_NOT_FOUND'>;
        export type AlreadyExist = IBody<'USER_ALREADY_EXIST'>;
    }
    export namespace Article {
        export type NotFound = IBody<'ARTICLE_NOT_FOUND'>;
    }
}
