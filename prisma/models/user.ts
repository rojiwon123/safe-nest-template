import { createModel } from "schemix";

import { Entity } from "../mixins";

export const User = createModel("UserModel", (model) => {
    model.mixin(Entity).string("name").string("email").map("users");
});
