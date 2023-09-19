export const isUnDeleted = <T extends { is_deleted: boolean }>(
    input: T,
): input is T & { is_deleted: false } => !input.is_deleted;

export const isDeleted = <T extends { is_deleted: boolean }>(
    input: T,
): input is T & { is_deleted: true } => !isUnDeleted(input);

/**
 * module의 타입 체크용
 */
export const typedModule = <T>(module: T) => {
    module;
};
