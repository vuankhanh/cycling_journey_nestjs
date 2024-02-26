import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class AlbumDto {
    @IsNotEmpty({ message: 'Name is required'})
    @IsString({ message: 'Name must be a string'})
    name: string;

    @IsOptional()
    @IsString({ message: 'Description must be a string'})
    description: string;

    
}