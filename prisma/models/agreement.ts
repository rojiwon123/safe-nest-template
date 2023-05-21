import { Entity } from "../mixins";
import { AgreementTargetType } from "../enums";
import { createModel } from "schemix";
import { User } from "./user";

export const Agreement = createModel("AgreementModel", (model) => {
  model
    .mixin(Entity)
    .string("title")
    .string("content")
    .boolean("is_required")
    .enum("target_type", AgreementTargetType)
    .relation("acceptances", AgreementAcceptance, { list: true })
    .map("agreements");
});

export const AgreementAcceptance = createModel(
  "AgreementAcceptanceModel",
  (model) => {
    model
      .mixin(Entity)
      .string("user_id")
      .string("agreement_id")
      .relation("user", User, {
        fields: ["user_id"],
        references: ["id"],
        onDelete: "NoAction",
        onUpdate: "NoAction"
      })
      .relation("agreement", Agreement, {
        fields: ["agreement_id"],
        references: ["id"],
        onDelete: "NoAction",
        onUpdate: "NoAction"
      })
      .unique({ fields: ["user_id", "agreement_id"] })
      .map("agreement_acceptances");
  }
);
