import * as nest from '@nestjs/common';

export class Exception<T extends string> extends nest.HttpException {
    constructor(
        public readonly body: IException<T>,
        status: number,
    ) {
        super(body, status);
        this.body = body;
    }
}

export interface IException<T extends string> {
    code: T;
    message?: string;
}
export namespace Exception {
    export namespace Permission {
        export type Required = IException<'PERMISSION_REQUIRED'>;
        export type Invalid = IException<'PERMISSION_INVALID'>;
        export type Expired = IException<'PERMISSION_EXPIRED'>;
    }
    export namespace User {
        export type NotFound = IException<'USER_NOT_FOUND'>;
        export type AlreadyExist = IException<'USER_ALREADY_EXIST'>;
    }
    export namespace Article {
        export type NotFound = IException<'ARTICLE_NOT_FOUND'>;
    }
}
