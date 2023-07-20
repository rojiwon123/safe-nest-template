import { identity } from "@fxts/core";
import { User } from "..";

export namespace Service {
    export const getFalse = identity(User.Service.getFalse);
}
