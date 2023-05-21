import { IConnection } from "@nestia/fetcher";
import { HttpStatus } from "@nestjs/common";
import { users } from "@SDK";
import { internal } from "@TEST/internal";
import { randomUUID } from "crypto";
import typia from "typia";

console.log("\n- users.getOne");

export const test_ok = async (connection: IConnection) => {
  const received = await users.getOne(connection, randomUUID());

  typia.assertEquals(received);
};

export const test_not_exist = internal.test_error((connection: IConnection) =>
  users.getOne(connection, "not found user id")
)(HttpStatus.NOT_FOUND, "User Not Found");
