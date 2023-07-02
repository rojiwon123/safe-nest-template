import { NotFoundException } from "@nestjs/common";

export namespace Exception {
    type NotFoundMessage = "User Not Found";
    export const NotFound = (message: NotFoundMessage) =>
        new NotFoundException(message);
}
