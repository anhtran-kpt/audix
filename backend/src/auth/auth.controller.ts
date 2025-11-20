import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthUser } from "src/common/decorators/auth-user.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { AuthUserPayload } from "./types/auth-user.payload";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { LoginResponseDto } from "./dto/login-response.dto";
import { LoginDto } from "./dto/login.dto";
import { UserEntity } from "src/users/entities/user.entity";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post("login")
  @UseGuards(AuthGuard("local"))
  @ApiOperation({ summary: "Login" })
  @ApiOkResponse({ type: LoginResponseDto })
  login(@AuthUser() user: AuthUserPayload, @Body() _loginDto: LoginDto) {
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
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOkResponse({ type: UserEntity })
  getProfile(@AuthUser() user: AuthUserPayload) {
    return new UserEntity(user);
  }
}
