/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignupDto } from './dto/signup.dto';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcryptjs'
import { Wallet, WalletDocument } from './schema/wallet.schema';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
      @InjectModel(User.name) private userModel: Model<UserDocument>,
      @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
      private jwtService: JwtService
    ) {}

  async signup(signupDto: SignupDto): Promise<{status: string, message: string, token: string, user: User, code: number}> {
    let {username, first_name, last_name, email, phone, password} = signupDto;
    const emailExists = await this.userModel.exists({ email });
    if (emailExists) {
        throw new ConflictException('User with this email already exists');
    }
    const usernameExists = await this.userModel.exists({ username });
    if (usernameExists) {
        throw new ConflictException('Username already exists');
    }
    password = await bcrypt.hash(password, 12);
    const user = await this.userModel.create({username, first_name, last_name, email, phone, password});
    // create wallet
    const wallet = await this.walletModel.findOneAndUpdate(
        {user: user._id},
        {user: user._id, balance: 0},
        {new: true, upsert: true, setDefaultsOnInsert: true}
    ).exec();

    // create token
    const payload: JwtPayload = { user_id: user._id, wallet_id: wallet._id };
    const token = this.jwtService.sign(payload);

    return {
        status: 'success',
        message: 'Successfully registered',
        token,
        user,
        code: 201
    }
  }
}
