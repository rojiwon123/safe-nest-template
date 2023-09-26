interface ITag {
    /** Both ERD and markdown content */
    namespace?: string;
    /** Only ERD */
    erd?: string;
    /** Only markdown content */
    describe?: string;
    /** Neither ERD nor markdown content */
    hidden?: string;
    /** erd writer */
    author?: string;
}

export const Comment = (...comments: string[]): `/// ${string}`[] =>
    comments.map<`/// ${string}`>((line) => `/// ${line}`);

export const ErdTag = (tags: ITag): `/// ${string}`[] => {
    const lines: `/// ${string}`[] = ["/// "];
    if (tags.namespace) lines.push(`/// @namespace ${tags.namespace}`);
    if (tags.erd) lines.push(`/// @erd ${tags.erd}`);
    if (tags.describe) lines.push(`/// @describe ${tags.describe}`);
    if (tags.hidden) lines.push(`/// @hidden ${tags.hidden}`);
    if (tags.author) lines.push(`/// @author ${tags.author}`);
    return lines;
};
