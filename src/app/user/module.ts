import { IUserService } from "./interface";

export const User: User = {
    Service: {},
};

export interface User {
    readonly Service: IUserService;
}
