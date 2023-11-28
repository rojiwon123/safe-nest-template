export namespace Description {
    export type Line = `/// ${string}` | `// ${string}`;
    type Namspace = "BBS" | "User";
    export const line = (text: string): Line => `/// ${text}`;
    export const lines = (...texts: string[]): Line[] =>
        texts.flatMap((text) => [line(text), line("")]);

    export const namespace = (text?: Namspace) => `@namespace ${text ?? "ALL"}`;
    export const erd = (text: string) => `@erd ${text}`;
    export const describe = (text: string) => `@describe ${text}`;
    export const hidden = (text: string) => `@hidden ${text}`;
    export const author = (text: string = "industriously") => `@author ${text}`;
}
