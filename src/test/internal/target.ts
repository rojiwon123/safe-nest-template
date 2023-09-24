import { IConnection } from "@nestia/fetcher";

import { IToken } from "@APP/app/token";

export type ITarget = IConnection<{
    Authorization: `${IToken.Type} ${string}`;
}>;
