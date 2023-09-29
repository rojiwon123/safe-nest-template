import { IConnection } from "@nestia/fetcher";

import { IToken } from "@APP/types/dto/IToken";

export type ITarget = IConnection<{
    Authorization: `${IToken.Type} ${string}`;
}>;

export type ITestFn = (connection: ITarget) => Promise<void>;
