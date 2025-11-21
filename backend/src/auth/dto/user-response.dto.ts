import { OmitType } from "@nestjs/swagger";
import { UserEntity } from "src/users/entities/user.entity";

export class UserResponseDto extends OmitType(UserEntity, [
  "passwordHash",
] as const) {
  constructor(partial: Partial<UserResponseDto>) {
    super();
    Object.assign(this, partial);
  }
}
