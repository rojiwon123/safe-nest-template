import { IFailure } from "@APP/api/types";
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(_: unknown, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        httpAdapter.reply(
            ctx.getResponse(),
            {
                code: "INTERNAL_ERROR",
                message: "알 수 없는 오류가 발생했습니다.",
            } satisfies IFailure,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
}
