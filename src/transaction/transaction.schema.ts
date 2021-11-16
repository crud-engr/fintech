/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Wallet } from "src/auth/schema/wallet.schema";
import * as mongoose from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema({timestamps: true})
export class Transaction {
    @Prop({required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Wallet'})
    wallet: Wallet; 

    @Prop({required: true, type: Number})
    amount: number;

    @Prop({required: true, enum: ['FUND', 'PAYMENT']})
    transaction_type: string;

    @Prop({required: true, default: 'none'})
    service: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
