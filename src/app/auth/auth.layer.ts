import { Layer } from "effect";

import { Make } from "@/util/make";

import { AuthService } from "./application/auth.service";

export const AuthLayer = Make.once(() => Layer.mergeAll(AuthService.layer()));
