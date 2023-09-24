interface ICommentTag {
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
export const Comment =
    (tags: ICommentTag) =>
    (comment: string): `/// ${string}`[] => {
        const tagline: `/// ${string}`[] = ["/// "];
        if (tags.namespace) tagline.push(`/// @namespace ${tags.namespace}`);
        if (tags.erd) tagline.push(`/// @erd ${tags.erd}`);
        if (tags.describe) tagline.push(`/// @describe ${tags.describe}`);
        if (tags.hidden) tagline.push(`/// @hidden ${tags.hidden}`);
        if (tags.author) tagline.push(`/// @author ${tags.author}`);

        return comment
            .split("\n")
            .map<`/// ${string}`>((line) => `/// ${line}`)
            .concat(tagline);
    };
