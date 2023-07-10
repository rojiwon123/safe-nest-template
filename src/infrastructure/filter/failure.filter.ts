import { Failure } from "@APP/utils/failure";
import { ExceptionFilter, Catch, ArgumentsHost } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch(Failure)
export class FailureFilter implements ExceptionFilter {
    constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

    catch(exception: Failure, host: ArgumentsHost) {
        const { httpAdapter } = this.httpAdapterHost;
        const ctx = host.switchToHttp();
        httpAdapter.reply(
            ctx.getResponse(),
            exception.getFailure(),
            exception.getStatusCode(),
        );
    }
}
