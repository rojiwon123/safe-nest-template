import { IAuthenticationService } from "./interface";
import { Service } from "./service";

export const Authentication: Authentication = { Service };

export interface Authentication {
    readonly Service: IAuthenticationService;
}
