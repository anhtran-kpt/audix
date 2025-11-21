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
import { RegisterDto } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
} from "@nestjs/swagger";
import { LoginResponseDto } from "./dto/login-response.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthUserPayload } from "./types/auth-user-payload.type";
import { UserResponseDto } from "./dto/user-response.dto";
import { RegisterResponseDto } from "./dto/register-response.dto";

@Controller("auth")
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiCreatedResponse({ type: RegisterResponseDto })
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return new RegisterResponseDto(result);
  }

  @Post("login")
  @UseGuards(AuthGuard("local"))
  @ApiOperation({ summary: "Login" })
  @ApiOkResponse({ type: LoginResponseDto })
  login(@AuthUser() user: AuthUserPayload, @Body() _loginDto: LoginDto) {
    return new LoginResponseDto(this.authService.login(user));
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  async googleAuth(@Request() _req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@AuthUser() user: AuthUserPayload) {
    return new LoginResponseDto(this.authService.login(user));
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserResponseDto })
  getProfile(@AuthUser() user: AuthUserPayload) {
    return new UserResponseDto(user);
  }
}
