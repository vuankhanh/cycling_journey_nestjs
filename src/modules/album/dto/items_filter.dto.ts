import { IsMongoId, IsOptional, IsString } from "class-validator";
import mongoose from "mongoose";
import { IsAtLeastOneOptional } from "src/shared/decorators/is_at_least_one_optional.decorator";

@IsAtLeastOneOptional(['route', 'id'])
export class ItemsFilterDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string' })
  route?: string;

  @IsOptional()
  @IsMongoId()
  id?: string;
}