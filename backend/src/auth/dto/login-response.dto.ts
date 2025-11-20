import { ApiProperty } from "@nestjs/swagger";
import { UserEntity } from "src/users/entities/user.entity";

export class LoginResponseDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({
    type: UserEntity,
  })
  user: UserEntity;
}
