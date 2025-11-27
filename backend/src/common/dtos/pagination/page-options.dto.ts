import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";
import { PAGINATION } from "src/common/constants/pagination.constant";

export enum Order {
  ASC = "asc",
  DESC = "desc",
}

export class PageOptionsDto {
  @ApiPropertyOptional({ enum: Order, description: "Order by time" })
  @IsEnum(Order)
  @IsOptional()
  readonly order?: Order;

  @ApiPropertyOptional({ minimum: 1, description: "Page number" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page?: number;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    description: "Items per page",
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(PAGINATION.MAX_TAKE)
  @IsOptional()
  readonly take?: number;

  @ApiPropertyOptional({ description: "Search keyword" })
  @IsString()
  @IsOptional()
  readonly q?: string;

  get skip(): number {
    return (this.pageNumber - 1) * this.takeNumber;
  }

  get takeNumber(): number {
    return this.take || PAGINATION.DEFAULT_TAKE;
  }

  get pageNumber(): number {
    return this.page || PAGINATION.DEFAULT_PAGE;
  }

  get orderValue(): Order {
    return this.order || Order.DESC;
  }

  get searchQuery(): string | undefined {
    return this.q ? this.q.trim() : undefined;
  }
}
