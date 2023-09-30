export namespace Comment {
    type Line = `/// ${string}`;
    export const line = (text: string): Line => `/// ${text}`;
    export const lines = (...texts: string[]): Line[] => texts.map(line);
    export const namespace = (text: string): `/// ${string}` =>
        line(`@namespace ${text}`);
    export const erd = (text: string): `/// ${string}` => line(`@erd ${text}`);
    export const describe = (text: string): `/// ${string}` =>
        line(`@describe ${text}`);
    export const hidden = (text: string): `/// ${string}` =>
        line(`@hidden ${text}`);
    export const author = (text: string = "industriously"): `/// ${string}` =>
        line(`@author ${text}`);
}
