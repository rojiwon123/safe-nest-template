import { IConnection } from '@nestia/fetcher';
import api from '@project/api';
import typia from 'typia';

export const test_health_check = async (connection: IConnection) => {
    const result = await api.functional.health.check(connection);

    typia.assert<{
        status: 200;
        data: 'hello world';
    }>(result);
};
