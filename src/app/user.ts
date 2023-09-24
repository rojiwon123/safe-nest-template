import typia from "typia";

import { IOauth } from "@APP/types/dto/IOauth";
import { IUser } from "@APP/types/dto/IUser";

export interface User {
    readonly create: (input: IOauth.IProfile) => Promise<IUser>;
}

export namespace User {
    export const create = async (input: IOauth.IProfile): Promise<IUser> => {
        input;
        return typia.random<IUser>();
    };
}
