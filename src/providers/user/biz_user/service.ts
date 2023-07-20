import { User } from "..";

export namespace Service {
    export const getTrue = () => true as const;
    export const getFalse = User.Service.flip(getTrue);
}
