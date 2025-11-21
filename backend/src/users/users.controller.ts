import {
  Controller,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { ApiExtraModels } from "@nestjs/swagger";
import { UserEntity } from "./entities/user.entity";

@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
@ApiExtraModels(UserEntity)
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get(":email")
  async findOneByEmail(@Param("email") email: string) {
    const user = await this.userService.findOneByEmail(email);

    return user;
  }
}
