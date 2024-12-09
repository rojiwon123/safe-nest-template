import { Layer } from "effect";

import { EffectLogger } from "@/infrastructure/logger";

import { UserModule } from "./user/user.module";

const layers = [UserModule] as const;

export const AppModule = () => Layer.mergeAll(...layers).pipe(Layer.provide(EffectLogger.get()));
