import { IDateTime } from "../common";

export type IUser = INormalUser | IAdmin;

export namespace IUser {
    export type Type = "normal" | "admin";

    export interface IBase<T extends Type> extends IDateTime {
        readonly type: T;
        readonly id: string;
        readonly name: string;
        /** @format email */
        readonly email: string;
    }

    export interface Password {
        password: string;
    }

    // swagger build fail, nonsensibl intersection type detected
    export type ICreate1 = Pick<IBase<"normal">, "name" | "email"> & {
        password: string;
    };

    // swagger build fail, nonsensibl intersection type detected
    export type ICreate2 = Pick<IBase<"normal">, "name" | "email"> & Password;

    // swagger build success
    export interface ICreate3
        extends Pick<IBase<"normal">, "name" | "email">,
            Password {}
}

export interface INormalUser extends IUser.IBase<"normal"> {}
export interface IAdmin extends IUser.IBase<"admin"> {}
