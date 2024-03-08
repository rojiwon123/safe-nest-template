import { IConnection } from '@nestia/fetcher';
import { HttpStatus } from '@nestjs/common';
import api from '@project/api';
import typia from 'typia';

import { IUser } from '@SRC/app/users/dto';
import { APIValidator } from '@SRC/test/internal/validator';
import { Random } from '@SRC/utils/random';

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
