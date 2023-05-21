import { Kakao } from "@devts/authjs";
import { Authentication } from "@PROVIDER/authentication";
import { Oauth } from "@PROVIDER/authentication/oauth";
import { mock as mk } from "node:test";
import typia from "typia";

export const mock = () => {
  mk.method(Oauth, "kakao").mock.mockImplementation(
    async (code: string): Promise<Kakao.IMeResponse> => {
      if (code === "invalid code")
        throw Authentication.Exception.AuthenticationFail;
      return typia.random<Kakao.IMeResponse>();
    }
  );
};
