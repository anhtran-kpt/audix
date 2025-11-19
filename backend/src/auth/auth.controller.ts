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
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthUserPayload } from "./types/auth-user.payload";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post("login")
  @UseGuards(AuthGuard("local"))
  login(@AuthUser() user: AuthUserPayload) {
    return this.authService.login(user);
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Request() _req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@AuthUser() user: AuthUserPayload) {
    return this.authService.login(user);
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  getProfile(@AuthUser() user: User) {
    return user;
  }
}
