import { NotFoundException } from "@nestjs/common";

export namespace Exception {
  export const NotFound = new NotFoundException("User Not Found");
}
