import { Layer } from "effect";

import { Once } from "@/util/once";

import { UsersUsecase } from "./users.usecase";

export const UserModule = Once.make(() => Layer.mergeAll(UsersUsecase.layer())).get;
