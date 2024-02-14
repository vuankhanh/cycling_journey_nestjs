import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
const roleEnums = ['user', 'admin'];

@Schema({
    timestamps: true
})
export class Account {
    @Prop({
        unique: [true, 'Username must be unique'],
        required: [true, 'Username is required']
    })
    username: string;

    @Prop({
        required: [true, 'Password is required']
    })
    password: string;

    @Prop()
    firstName: string;

    @Prop()
    lastName: string;

    @Prop({ unique: [true, 'Email must be unique'] })
    email: string;

    @Prop({
        enum: roleEnums, default: roleEnums[0],
        required: [true, 'Role is required']
    })
    role: string;
}

export const accountSchema = SchemaFactory.createForClass(Account);