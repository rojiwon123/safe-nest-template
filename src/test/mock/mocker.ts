export const mocker = <T extends object, K extends keyof T>({
    module,
    exporter,
    mocked,
}: {
    module: T;
    exporter: K;
    mocked: T[K];
}) => {
    module[exporter] = mocked;
};
