export declare namespace NestiaSimulator {
    interface IProps {
        host: string;
        path: string;
        method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    }
    const assert: (props: IProps) => {
        param: (name: string) => (type: string) => <T>(task: () => T) => void;
        query: <T_1>(task: () => T_1) => void;
        body: <T_2>(task: () => T_2) => void;
    };
}
