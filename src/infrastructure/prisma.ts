import { Prisma, PrismaClient } from '@PRISMA';

import { Result } from '@SRC/common/result';

import { Configuration } from './config';
import { logger } from './logger';

const _prisma = new PrismaClient({
    datasources: { database: { url: Configuration.DATABASE_URL } },
    log:
        Configuration.NODE_ENV === 'development'
            ? [
                  { emit: 'event', level: 'error' },
                  { emit: 'event', level: 'warn' },
                  { emit: 'event', level: 'info' },
                  { emit: 'event', level: 'query' },
              ]
            : [
                  { emit: 'event', level: 'error' },
                  { emit: 'event', level: 'warn' },
              ],
});

_prisma.$on('error', logger.error);
_prisma.$on('warn', logger.warn);

if (Configuration.NODE_ENV === 'development') {
    _prisma.$on('query', logger.info);
    _prisma.$on('info', logger.info);
}

export const prisma = _prisma.$extends({
    client: {
        $safeTransaction: async <T, E>(
            closure: (tx: Prisma.TransactionClient) => Promise<Result<T, E>>,
        ): Promise<Result<T, E>> => {
            const rollback = new Error('transaction rollback');
            return _prisma
                .$transaction((tx) =>
                    closure(tx).then((result) =>
                        result.match(
                            (ok) => Result.Ok<T, E>(ok),
                            (err) => {
                                rollback.cause = err;
                                throw rollback;
                            },
                        ),
                    ),
                )
                .catch((error: unknown) => {
                    if (Object.is(rollback, error))
                        return Result.Err<T, E>(rollback.cause as E);
                    throw error; // unexpected error
                });
        },
    },
}) as unknown as Prisma.TransactionClient & {
    $transaction: typeof _prisma.$transaction;
    /** Connect with the databas */
    $connect: typeof _prisma.$connect;
    /** Disconnect from the database */
    $disconnect: typeof _prisma.$disconnect;
    /**
     * Transaction with `Result` Instance
     *
     * If closure return `Result.Err` instance, transaction execute rollback.
     */
    $safeTransaction: <T, E>(
        closure: (tx: Prisma.TransactionClient) => Promise<Result<T, E>>,
    ) => Promise<Result<T, E>>;
};

// extends를 통해 orm method의 반환값을 변경할 수 있다.
// 그래서 PrismaClient 타입 정보가 충돌하는데, 나는 반환값을 변경하는 extends를 추가하지 않았으므로
// as keyword로 타입을 변경하였다.
