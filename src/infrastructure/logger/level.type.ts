import { LogLevel } from "effect";

/** "ALL" | "FATAL" | "ERROR" | "WARN" | "INFO" | "DEBUG" | "TRACE" | "OFF" */
export type LogLevelType = LogLevel.LogLevel["label"];
