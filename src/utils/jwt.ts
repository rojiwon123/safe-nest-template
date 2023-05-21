import { isUndefined } from "@fxts/core";

export const getJwtPayload = (token: string): string | null => {
  const payload = token.split(".")[1];
  if (isUndefined(payload)) return null;
  return Buffer.from(payload, "base64").toString("utf-8");
};
