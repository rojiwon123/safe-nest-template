import { Effect, Exit, ManagedRuntime, pipe } from "effect";
import { Request } from "express";

import { AppModule } from "@/app/app.module";
import { Err } from "@/common/err/err";
import { PrismaErr } from "@/infrastructure/db";
import { Make } from "@/util/make";

export namespace EffectHandler {
    export const runtime = Make.once(() => ManagedRuntime.make(AppModule()));
    export const respond = <A, Code extends string>(exit: Exit.Exit<A, Err<Err.Body<Code>> | PrismaErr>, mapper: Record<Code, number>): A =>
        Exit.match(exit, {
            onSuccess: (i) => i,
            onFailure(cause) {
                switch (cause._tag) {
                    case "Fail":
                        const err = cause.error;
                        if (err instanceof PrismaErr) throw new Err.Http(500, { code: "INTERNAL_SERVER_ERROR" }); // unhandled prisma error
                        throw err.toHttp(mapper[err.body.code]);
                    case "Die":
                    case "Empty":
                    case "Interrupt":
                    case "Sequential":
                    case "Parallel":
                        throw new Err.Http(500, { code: "INTERNAL_SERVER_ERROR" });
                }
            },
        });

    export const trace =
        (req: Request) =>
        <A, E, R>(effect: Effect.Effect<A, E, R>) => {
            const started_at = new Date();
            const tap = (input: unknown) =>
                pipe(
                    Effect.log("\n[TRACE RESPONSE]", input),
                    Effect.annotateLogs("Duration", `${new Date().getTime() - started_at.getTime()}ms`),
                    Effect.annotateLogs("Timestamp", started_at),
                    Effect.annotateLogs("Http Method", req.method),
                    Effect.annotateLogs("Http Path", req.path),
                    Effect.annotateLogs("Http Params", req.params),
                    Effect.annotateLogs("Http Query", req.query),
                    Effect.annotateLogs("Http Body", req.body),
                );
            return pipe(
                effect,
                Effect.tap((ok) => tap(ok)),
                Effect.tapErrorCause((c) => tap(c.toJSON())),
                Effect.annotateLogs("TraceId", Make.uuid()),
            );
        };
}
