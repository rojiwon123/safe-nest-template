import { IConnection } from "@nestia/fetcher";
import { HttpStatus } from "@nestjs/common";
import { auth } from "@SDK";
import { test_error } from "@TEST/internal/fragment";

console.log("\n- auth.sign_in.kakao.execute");

export const test_ok = async (connection: IConnection) => {
  await auth.sign_in.kakao.execute(connection, { code: "test code" });
};

export const test_authentication_fail = test_error((connection: IConnection) =>
  auth.sign_in.kakao.execute(connection, { code: "invalid code" })
)(HttpStatus.UNAUTHORIZED, "Authentication Fail");
