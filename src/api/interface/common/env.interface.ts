export interface IEnv {
  readonly NODE_ENV: "development" | "production" | "test";
  readonly PORT: string | number;
}
