export type Extract<T, U extends T> = T extends U ? T : never;
