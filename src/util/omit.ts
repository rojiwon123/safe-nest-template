export type OmitKeyof<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
