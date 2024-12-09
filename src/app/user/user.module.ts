import { Layer } from "effect";

import { UsersUsecase } from "./users.usecase";

export const UserModule = Layer.mergeAll(UsersUsecase.layer);
