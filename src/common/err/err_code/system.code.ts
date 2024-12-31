import { Err } from "@/common/err/err";

export namespace SystemErr {
    export interface API_NOT_FOUND extends Err.Body<"API_NOT_FOUND"> {}
    export interface INPUT_INVALID extends Err.Body<"INPUT_INVALID"> {}
    export interface INTERNAL_SERVER_ERROR extends Err.Body<"INTERNAL_SERVER_ERROR"> {}
}
