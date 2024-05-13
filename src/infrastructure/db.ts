import { Prisma, PrismaClient } from '@PRISMA';

import { Result } from '@SRC/common/result';

import { Configuration } from './config';
import { logger } from './logger';

const prisma = new PrismaClient({
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

prisma.$on('error', logger.error);
prisma.$on('warn', logger.warn);

if (Configuration.NODE_ENV === 'development') {
    prisma.$on('query', logger.info);
    prisma.$on('info', logger.info);
}

export const db = prisma.$extends({
    client: {
        $safeTransaction: async <T, E>(
            closure: (tx: Prisma.TransactionClient) => Promise<Result<T, E>>,
        ): Promise<Result<T, E>> => {
            const rollback = new Error('transaction rollback');
            try {
                const end: Result.Ok<T> = await prisma.$transaction(
                    async (tx) => {
                        const result = await closure(tx);
                        if (Result.Error.is(result)) {
                            rollback.cause = result;
                            throw rollback;
                        }
                        return result;
                    },
                );
                return end;
            } catch (error: unknown) {
                if (Object.is(rollback, error))
                    return rollback.cause as Result.Error<E>;
                throw error; // unexpected error
            }
        },
    },
}) as unknown as Prisma.TransactionClient & {
    $transaction: typeof prisma.$transaction;
    /** Connect with the databas */
    $connect: typeof prisma.$connect;
    /** Disconnect from the database */
    $disconnect: typeof prisma.$disconnect;
    /**
     * Transaction with `Result` Instance
     *
     * If closure return `Result.Error` instance, transaction execute rollback.
     */
    $safeTransaction: () => <T, E>(
        closure: (tx: Prisma.TransactionClient) => Promise<Result<T, E>>,
    ) => Promise<Result<T, E>>;
};

// extends를 통해 orm method의 반환값을 변경할 수 있다.
// 그래서 PrismaClient 타입 정보가 충돌하는데, 나는 반환값을 변경하는 extends를 추가하지 않았으므로
// as keyword로 타입을 변경하였다.
