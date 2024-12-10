import { Layer } from "effect";

import { EffectLogger } from "@/infrastructure/logger";

import { UserModule } from "./user/user.module";

export const AppModule = () => Layer.mergeAll(UserModule()).pipe(Layer.provide(EffectLogger.get()));
