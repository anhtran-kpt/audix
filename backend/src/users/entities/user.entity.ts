import { ApiProperty } from "@nestjs/swagger";
import { User as PrismaUser, UserRole } from "generated/prisma";
import { Exclude } from "class-transformer";

export class UserEntity implements PrismaUser {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  image: string | null;

  @Exclude()
  passwordHash: string | null;

  @ApiProperty()
  role: UserRole;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
