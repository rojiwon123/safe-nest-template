import { Context, Effect, Layer } from "effect";

import { Make } from "./make";

export const createLayer =
    <Tag extends Context.Tag<any, any>, Cons extends new (...args: any[]) => Context.Tag.Service<Tag>>(tag: Tag, cons: Cons) =>
    <E, R>(eff: Effect.Effect<ConstructorParameters<Cons>, E, R>) =>
        Make.once(() =>
            Layer.effect(
                tag,
                Effect.map(eff, (props) => new cons(...props)),
            ),
        );
