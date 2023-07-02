import { IDateTime } from "../common";
export type IUser = INormalUser | IAdmin;
export declare namespace IUser {
    type Type = "normal" | "admin";
    interface IBase<T extends Type> extends IDateTime {
        readonly type: T;
        readonly id: string;
        readonly name: string;
        /** @format email */
        readonly email: string;
    }
    interface Password {
        password: string;
    }
    type ICreate1 = Pick<IBase<"normal">, "name" | "email"> & {
        password: string;
    };
    type ICreate2 = Pick<IBase<"normal">, "name" | "email"> & Password;
    interface ICreate3 extends Pick<IBase<"normal">, "name" | "email">, Password {
    }
}
export interface INormalUser extends IUser.IBase<"normal"> {
}
export interface IAdmin extends IUser.IBase<"admin"> {
}
