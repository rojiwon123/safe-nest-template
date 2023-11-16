import { IPropagation } from "@nestia/fetcher";

import { IPage } from "@APP/types/IPage";

export namespace APIValidator {
    class APIValidation extends Error {
        constructor(
            public expected: { success: boolean; status: IPropagation.Status },
            public actual: { success: boolean; status: IPropagation.Status },
        ) {
            super("The API response is not as expected");
            this.name = "APIValidation";
        }
    }
    type Success<
        P extends IPropagation.IBranch<boolean, unknown, any>,
        Status,
    > = P extends IPropagation.IBranch<boolean, Status, any>
        ? P["success"]
        : never;

    type Body<
        P extends IPropagation.IBranch<boolean, unknown, any>,
        Status extends IPropagation.Status,
    > = P extends IPropagation.IBranch<boolean, Status, any>
        ? P["data"]
        : never;

    export const assert =
        <
            P extends IPropagation.IBranch<boolean, unknown, any>,
            S extends IPropagation.Status,
        >(
            response: Promise<P>,
            expected_status: S,
        ) =>
        async (expected: {
            success: Success<P, S>;
            assertBody: (input: unknown) => Body<P, S>;
            assertHeaders?: <Headers extends Record<string, string | string[]>>(
                input: unknown,
            ) => Headers;
        }): Promise<Body<P, S>> => {
            const { status, success, data, headers } = await response;
            if (expected_status !== status || expected.success !== success) {
                throw new APIValidation(
                    { success: expected.success, status: expected_status },
                    { success, status },
                );
            }
            if (expected.assertBody) expected.assertBody(data);
            if (expected.assertHeaders) expected.assertHeaders(headers);
            return data;
        };

    export const assertNotEmpty =
        <T extends IPage.IPaginated<R>, R>(
            assertEquals: (input: unknown) => T,
        ) =>
        (input: unknown): T => {
            const body = assertEquals(input);
            if (body.data.length === 0) throw Error("list is empty");
            return body;
        };
}
