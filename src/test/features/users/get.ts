import { IConnection } from '@nestia/fetcher';
import { HttpStatus } from '@nestjs/common';
import api from '@project/api';
import typia from 'typia';

import { IUser } from '@SRC/app/users/dto';
import { Random } from '@SRC/common/random';
import { APIValidator } from '@SRC/test/internal/validator';

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
