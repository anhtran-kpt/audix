import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthUserPayload } from "../types/auth-user.payload";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({ usernameField: "email" });
  }

  async validate(email: string, pass: string): Promise<AuthUserPayload> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isMatch = await bcrypt.compare(pass, user.passwordHash);

    if (!isMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const { passwordHash: _, ...result } = user;

    return result;
  }
}
