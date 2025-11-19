import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { Profile } from "passport-google-oauth20";
import { AuthUserPayload } from "./types/auth-user.payload";
import { UserRole } from "./enums/role.enum";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        passwordHash: passwordHash,
        role: UserRole.USER,
      },
      omit: {
        passwordHash: true,
      },
    });

    return this.login(user);
  }

  login(user: AuthUserPayload): { access_token: string } {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role as UserRole,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateOAuthUser(profile: Profile) {
    const provider = "google";
    const providerAccountId = profile.id;

    if (!profile.emails || !profile.emails[0]) {
      throw new UnauthorizedException("No email found in Google profile");
    }

    const email = profile.emails[0].value;
    const name = profile.name?.givenName + " " + profile.name?.familyName;
    const image = profile.photos ? profile.photos[0].value : null;

    const account = await this.prisma.account.findUnique({
      where: {
        provider_providerAccountId: { provider, providerAccountId },
      },
      include: { user: true },
    });

    if (account) {
      return account.user;
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      await this.prisma.account.create({
        data: {
          provider,
          providerAccountId,
          userId: user.id,
        },
      });
      return user;
    } else {
      const newUser = await this.prisma.user.create({
        data: {
          email,
          name,
          image,
          accounts: {
            create: {
              provider,
              providerAccountId,
            },
          },
        },
      });
      return newUser;
    }
  }
}
