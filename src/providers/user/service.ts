import { IUser } from "@DTO/user/user";
import { Mutable } from "@TYPE";
import typia from "typia";
import { Exception } from "./exception";

export namespace Service {
  /**
   * @throw Not Found
   */
  export const getOne = async (user_id: string): Promise<IUser> => {
    const user = typia.random<Mutable<IUser>>();
    user.id = user_id;
    if (user_id === "not found user id") throw Exception.NotFound;
    return user;
  };
}
