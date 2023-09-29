import api from "@PROJECT/api";
import { ArrayUtil } from "@nestia/e2e";

import { ITestFn } from "@APP/test/internal/type";
import { Util } from "@APP/test/internal/utils";

Util.md.ToggleStart("auth.oauth.url.getUrl");

export const test_success: ITestFn = async (connection) => {
    const results = await ArrayUtil.asyncMap(["github", "kakao"] as const)(
        (oauth) => api.functional.auth.oauth.url.getUrl(connection, { oauth }),
    );
    results;
};
