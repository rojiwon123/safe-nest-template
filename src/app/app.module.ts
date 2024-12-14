import { Layer } from "effect";

import { EffectLogger } from "@/infrastructure/logger";
import { Make } from "@/util/make";

import { UserModule } from "./user/user.module";

export const AppModule = Make.once(() => Layer.mergeAll(UserModule()).pipe(Layer.provide(EffectLogger())));
