import core from "@nestia/core";
import * as nest from "@nestjs/common";

@nest.Controller("health")
export class HealthController {
    /**
     * Just for health checking API liveness.
     *
     * @summary Health check API
     * @tag system
     */
    @core.TypedRoute.Get()
    get(): void {}
}
