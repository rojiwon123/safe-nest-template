import { IOauth } from "@APP/types/dto/IOauth";

export namespace IAuthentication {
    export interface IGetLoginUrl {
        oauth: IOauth.Type;
    }
}
