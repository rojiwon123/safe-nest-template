import { Layer } from "effect";

import { EffectLogger } from "@/infrastructure/logger/effect";
import { Make } from "@/util/make";

import { AuthLayer } from "./auth/auth.layer";
import { UserLayer } from "./user/user.layer";

export const AppLayer = Make.once(() => Layer.mergeAll(AuthLayer(), UserLayer()).pipe(Layer.provide(EffectLogger())));
