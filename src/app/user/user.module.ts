import { Layer } from "effect";

import { Make } from "@/util/make";

import { UsersUsecase } from "./users.usecase";

export const UserModule = Make.once(() => Layer.mergeAll(UsersUsecase.layer()));
