import { IUser } from "@DTO/user/user";
import { TypedParam, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { User } from "@PROVIDER/user";

@Controller("users")
export class UsersController {
  /**
   * @summary user find by user id
   * @tag users
   * @param user_id user id
   * @return user info
   * @throw 404 Not Found
   */
  @TypedRoute.Get(":user_id")
  getOne(@TypedParam("user_id") user_id: string): Promise<IUser> {
    return User.Service.getOne(user_id);
  }
}
