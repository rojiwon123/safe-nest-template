import { Make } from "@/util/make";

import { UsersUsecase } from "./users.usecase";

export const UserLayer = Make.once(() => UsersUsecase.layer());
