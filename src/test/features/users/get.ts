import { IConnection } from "@nestia/fetcher";
import { HttpStatus } from "@nestjs/common";
import api from "@project/api";
import typia from "typia";

import { APIValidator } from "@APP/test/internal/validator";
import { IUser } from "@APP/types/IUser";
import { Random } from "@APP/utils/random";

const test = api.functional.users.get;

export const test_get_user_successfully = async (connection: IConnection) => {
    await APIValidator.assert(
        test(connection, Random.uuid()),
        HttpStatus.OK,
    )({
        success: true,
        assertBody: typia.createAssertEquals<IUser>(),
    });
};
