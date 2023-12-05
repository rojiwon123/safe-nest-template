export namespace Tag {
    type Namspace = "User";
    export const namespace = (text?: Namspace) => `@namespace ${text ?? "All"}`;
    export const erd = (text: string) => `@erd ${text}`;
    export const describe = (text: string) => `@describe ${text}`;
    export const hidden = (text: string) => `@hidden ${text}`;
    export const author = (text: string = "rojiwon") => `@author ${text}`;
}
