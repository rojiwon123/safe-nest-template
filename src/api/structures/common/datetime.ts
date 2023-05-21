export interface IDateTime {
  /** @format date-time */
  readonly created_at: string;
  /** @format date-time */
  readonly updated_at: string;
}

export interface ISoftDeletable {
  /** 삭제 여부 */
  readonly is_deleted: boolean;
  /** @format date-time */
  readonly deleted_at: string | null;
}
