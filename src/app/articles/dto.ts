import { IPage } from '@SRC/common/dto';
import { Regex } from '@SRC/common/type';

import { IUser } from '../users/dto';

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
