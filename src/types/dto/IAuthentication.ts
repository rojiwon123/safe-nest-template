import { IOauth } from "./IOauth";

export namespace IAuthentication {
    export interface IGetLoginUrl {
        oauth: IOauth.Type;
    }
}
