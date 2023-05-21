import { IDateTime } from "@DTO/common";

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
}

export interface INormalUser extends IUser.IBase<"normal"> {}
export interface IAdmin extends IUser.IBase<"admin"> {}
