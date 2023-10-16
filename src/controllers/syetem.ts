import core from "@nestia/core";
import * as nest from "@nestjs/common";

@nest.Controller("health")
export class SystemController {
    /**
     * Just for health checking API Server liveness.
     *
     * @summary Health check API
     * @tag system
     */
    @core.TypedRoute.Get()
    get(): void {}
}
