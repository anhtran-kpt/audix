import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID")!,
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET")!,
      callbackURL: configService.get("GOOGLE_CALLBACK_URL")!,
      scope: ["email", "profile"],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback
  ) {
    const user = await this.authService.validateOAuthUser(profile);

    done(null, user);
  }
}
