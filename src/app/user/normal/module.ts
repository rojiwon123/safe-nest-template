import { INormalService } from "./interface";
import { Service } from "./service";

export const Normal: Normal = { Service };

export interface Normal {
    readonly Service: INormalService;
}
