import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GoogleStrategy } from "./google.strategy";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("JWT_SECRET_KEY"),

        signOptions: {
          expiresIn: "1h",
        },
      }),
      inject: [ConfigService],
    }),
    PrismaModule,
    UsersModule,
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
})
export class AuthModule {}
