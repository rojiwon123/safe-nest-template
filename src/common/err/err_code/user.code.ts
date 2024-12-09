import { Err } from "../err";

export namespace UserErr {
    export interface NotFound extends Err.Body<"USER_NOT_FOUND"> {}
}
