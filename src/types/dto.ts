/**
 * 주소 데이터 형식
 */
export interface IAddress {
    /**
     * 도로명 주소
     */
    readonly road: string;
    /**
     * 우편 번호
     */
    readonly zone_code: string;
    /**
     * 상세 주소
     */
    readonly detail: null | string;
    /**
     * 참고 사항
     */
    readonly extra: null | string;
}

export interface IPaginatedResponse<T> {
    readonly data: T[];
    /**
     * @type uint
     * @minimum 1
     */
    readonly page: number;
}

export interface IPage {
    /**
     * @default 1
     * @type uint
     * @minimum 1
     */
    page?: number;
}
