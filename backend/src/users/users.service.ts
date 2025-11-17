import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
}
