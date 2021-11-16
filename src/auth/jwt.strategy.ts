/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Req, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./interface/jwt-payload.interface";
import { User, UserDocument } from "./schema/user.schema";
import { Wallet, WalletDocument } from "./schema/wallet.schema";
import * as jwt from 'jsonwebtoken';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'fintech-backend-api'
        })
    }

    async validate(@Req() req) {
        return req;
    }
}

