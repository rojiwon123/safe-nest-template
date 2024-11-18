import core from "@nestia/core";
import * as nest from "@nestjs/common";

@nest.Controller("health")
export class HealthController {
    /**
     * Just for health checking API Server liveness.
     *
     * @summary Health check API
     * @tag system
     * @return hello world!
     */
    @core.TypedRoute.Get()
    async check(): Promise<"hello world!"> {
        return "hello world!";
    }
}
