/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as mongoose from 'mongoose';
import { User } from "./user.schema";

export type WalletDocument = Wallet & Document;

@Schema({timestamps: true})
export class Wallet {
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user: User; 

    @Prop({type: Number})
    balance: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
