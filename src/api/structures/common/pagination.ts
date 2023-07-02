export interface IPaginatedResponse<T> {
    data: T[];
    /**
     * @type uint
     * @minimum 1
     */
    page: number;
}

export interface IPage {
    /**
     * @default 1
     * @type uint
     * @minimum 1
     */
    page?: number;
}
