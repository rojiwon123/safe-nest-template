import typia from "typia";

import { Regex } from "@/util/type";

import { UserProfileDTO } from "./user.dto";

export namespace UsersUsecase {
    export const profile = async (input: { user_id: Regex.UUID }): Promise<UserProfileDTO> => {
        return { ...typia.random<UserProfileDTO>(), id: input.user_id };
    };
}
