import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MilestoneDto {
    @IsNotEmpty({ message: 'NumbericalOrder is required' })
    @IsNumber({}, { message: 'Username must be a string' })
    readonly numericalOrder: number;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    readonly name: string;

    @IsNotEmpty({ message: 'Address is required' })
    @IsString({ message: 'Address must be a string' })
    readonly address: string;

    @IsNotEmpty({ message: 'Datetime is required' })
    @IsDate({ message: 'Datetime must be a date' })
    readonly dateTime: Date;

    @IsNotEmpty({ message: 'Coordinates is required' })
    readonly coordinates: Location;

    @IsNotEmpty({ message: 'AlbumId is required' })
    readonly albumId: string;
}