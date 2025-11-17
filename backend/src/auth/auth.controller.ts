import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { User } from "generated/prisma";
import { CreateUserDto } from "./dto/create-user.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post("login")
  @UseGuards(AuthGuard("local"))
  login(@AuthUser() user: User) {
    return this.authService.login(user);
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Request() _req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@AuthUser() user: User) {
    const token = this.authService.login(user);

    return token;
  }
}
