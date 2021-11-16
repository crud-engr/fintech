/* eslint-disable prettier/prettier */

import {IsNotEmpty, IsNumber, IsString } from "class-validator";

export class MakePaymentDto {
    @IsNumber()
    @IsNotEmpty()
    amount: number; 

    @IsString()
    @IsNotEmpty()
    service: string; 
}