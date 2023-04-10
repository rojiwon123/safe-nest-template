import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  check() {
    throw Error();
    // return "hello world";
  }
}
