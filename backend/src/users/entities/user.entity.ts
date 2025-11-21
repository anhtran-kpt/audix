import { ApiHideProperty, ApiProperty } from "@nestjs/swagger";
import { User as PrismaUser, UserRole } from "generated/prisma";
import { Exclude } from "class-transformer";

export class UserEntity implements PrismaUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  image: string | null;

  @Exclude()
  @ApiHideProperty()
  passwordHash: string | null;

  @ApiProperty({
    enum: UserRole,
    enumName: "UserRole",
    example: UserRole.USER,
  })
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
