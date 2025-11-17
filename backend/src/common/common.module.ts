import { Module, Global } from "@nestjs/common";
import { SlugService } from "./services/slug.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Global()
@Module({
  imports: [PrismaModule],
  providers: [SlugService],
  exports: [SlugService],
})
export class CommonModule {}
