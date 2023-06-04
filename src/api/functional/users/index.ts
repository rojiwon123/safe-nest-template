/**
 * @packageDocumentation
 * @module api.functional.users
 * @nestia Generated by Nestia - https://github.com/samchon/nestia 
 */
//================================================================
import { Fetcher } from "@nestia/fetcher";
import type { IConnection } from "@nestia/fetcher";

import type { IUser } from "./../../structures/user/user";

/**
 * this is sample api
 * @summary user find by user id
 * @tag users
 * @param user_id user id
 * @return user info
 * @throw 404 Not Found
 * 
 * @controller UsersController.getOne()
 * @path GET /users/:user_id
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export function getOne
    (
        connection: IConnection,
        user_id: string
    ): Promise<getOne.Output>
{
    return Fetcher.fetch
    (
        connection,
        getOne.ENCRYPTED,
        getOne.METHOD,
        getOne.path(user_id)
    );
}
export namespace getOne
{
    export type Output = IUser;

    export const METHOD = "GET" as const;
    export const PATH: string = "/users/:user_id";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(user_id: string): string
    {
        return `/users/${encodeURIComponent(user_id ?? "null")}`;
    }
}