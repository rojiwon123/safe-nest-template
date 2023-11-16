import { IPage } from "./IPage";
import { IUser } from "./IUser";
import { Regex } from "./global";

export interface IArticle {
    id: Regex.UUID;
    author: IUser;
    body: string;
    created_at: Regex.DateTime;
    updated_at: Regex.DateTime | null;
}

export namespace IArticle {
    export interface ISearch extends IPage.ISearch {
        /** @default latest */
        sort?: IPage.SortType;
        author_id?: Regex.UUID;
    }
    export interface IPaginated extends IPage.IPaginated<IArticle> {}
}
