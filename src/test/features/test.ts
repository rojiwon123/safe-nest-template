import { IAuthentication } from "@APP/api/structures/authentication";
import { Authentication } from "@APP/providers/authentication";
import typia from "typia";

export const test_api = async () => {
    const input = typia.random<IAuthentication.ISignIn>();
    await Authentication.Service.signIn(input);
};
