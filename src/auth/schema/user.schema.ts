/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type UserDocument = User & Document;

@Schema({timestamps: true})
export class User {
    @Prop({required: true, trim: true})
    username: string; 

    @Prop({required: true, trim: true})
    first_name: string;

    @Prop({required: true, trim: true})
    last_name: string;

    @Prop({required: true, unique: true, trim: true, lowercase: true})
    email: string;

    @Prop({required: true, trim: true})
    phone: string;

    @Prop({required: true, trim: true})
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
