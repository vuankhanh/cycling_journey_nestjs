import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Account } from "./account.schema";

@Schema({
    collection: 'user_token',
    timestamps: true
})
export class Refresh_Token {
    @Prop({required: true, unique: true, ref: Account.name})
    accountId: mongoose.Schema.Types.ObjectId;

    @Prop({required: true})
    token: string;

    @Prop({required: true})
    expiresAt: Date;
}

export const refreshTokenSchema = SchemaFactory.createForClass(Refresh_Token);