import { IsDateString, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import mongoose, { ObjectId } from "mongoose";
import { ILocation } from "src/shared/interfaces/location.interface";

export class MilestoneDto {
    @IsNotEmpty({ message: 'NumbericalOrder is required' })
    @IsNumber({}, { message: 'NumericalOrder must be a number'})
    @IsOptional()
    numericalOrder?: number;

    @IsNotEmpty({ message: 'Name is required' })
    @IsString({ message: 'Name must be a string' })
    readonly name: string;

    @IsNotEmpty({ message: 'Address is required' })
    @IsString({ message: 'Address must be a string' })
    readonly address: string;

    @IsNotEmpty({ message: 'Datetime is required' })
    @IsDateString({}, { message: 'Datetime must be a date' })
    readonly dateTime: Date;

    @IsNotEmpty({ message: 'Coordinates is required' })
    readonly coordinates: ILocation;

    @IsMongoId()
    @IsOptional()
    albumId?: mongoose.Types.ObjectId;
}