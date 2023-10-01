export namespace Comment {
    type Line = `/// ${string}`;
    type Namspace = "BBS" | "User";
    export const line = (text: string): Line => `/// ${text}`;
    export const lines = (...texts: string[]): Line[] => texts.map(line);
    export const namespace = (text?: Namspace): `/// ${string}` =>
        line(`@namespace ${text ?? "All"}`);
    export const erd = (text: string): `/// ${string}` => line(`@erd ${text}`);
    export const describe = (text: string): `/// ${string}` =>
        line(`@describe ${text}`);
    export const hidden = (text: string): `/// ${string}` =>
        line(`@hidden ${text}`);
    export const author = (text: string = "industriously"): `/// ${string}` =>
        line(`@author ${text}`);
}
