import { IConnection } from '@nestia/fetcher';
import sdk from '@project/api';
import typia from 'typia';

import { IUser } from '@SRC/app/users/dto';
import { Random } from '@SRC/common/random';

export const test_get_user_successfully = async (connection: IConnection) => {
    const result = await sdk.functional.users.get(connection, Random.uuid());
    typia.assert<{ status: 200; data: IUser }>(result);
};
