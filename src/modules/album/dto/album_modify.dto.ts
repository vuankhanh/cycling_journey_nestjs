import { Transform, Type } from "class-transformer";
import { IsArray, IsMongoId, IsOptional, IsString } from "class-validator";
import { MongoIdDto } from "src/shared/dto/mongodb.dto";

export class AlbumModifyDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @Transform(({ value }) => {
    return JSON.parse(value)
  }, { toClassOnly: true })
  @IsArray()
  @IsMongoId({ each: true })
  @Type(() => String)
  filesWillRemove: string[];
}