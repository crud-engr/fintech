/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, Req, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/schema/user.schema';
import { Wallet, WalletDocument } from 'src/auth/schema/wallet.schema';
import { Transaction, TransactionDocument } from 'src/transaction/transaction.schema';
import { FundDto } from './dto/fund.dto';
import * as moment from 'moment';
import { MakePaymentDto } from './dto/pay-for-service.dto';

@Injectable()
export class ServicesService {
    constructor(
        @InjectModel(Wallet.name) private wallet: Model<WalletDocument>,
        @InjectModel(Transaction.name) private transaction: Model<TransactionDocument>,
        @InjectModel(User.name) private user: Model<UserDocument>
    ) {}


    async fund(fundDto: FundDto, @Req() req): Promise<{status: string, message: string, code: number}> {
        const formatTokenTime = new Date(req.user.exp * 1000);
        const token_expiry_time = moment(formatTokenTime).format();
        const now = moment().format()

        if (now > token_expiry_time) {
            throw new UnauthorizedException('Token has expired. Please log in again');
        }

        const { amount } = fundDto;
        if (amount < 1000) {
            throw new BadRequestException('Amount you can fund must be 1000 and above');
        }

        const walletId = req.user.wallet_id;
        const stored_wallet = await this.wallet.findOne({ _id: walletId }).exec();

        if (!stored_wallet) throw new BadRequestException('wallet not found');

        // increment wallet
        await this.wallet.findOneAndUpdate(
            { _id: stored_wallet },
            { $inc: { balance: amount }}
        ).exec();

        // transaction log
        await this.transaction.create(
            {
                wallet: stored_wallet,
                amount,
                transaction_type: 'FUND',
            }
        )
        return {status: 'success', message: 'wallet successfully funded', code: 200};
    }

    async userDetails(id: string, @Req() req): Promise<{user: User, balance: number}> {
        const formatTokenTime = new Date(req.user.exp * 1000);
        const token_expiry_time = moment(formatTokenTime).format();
        const now = moment().format()

        if (now > token_expiry_time) {
            throw new UnauthorizedException('Token has expired. Please log in again');
        }

        const user = await this.user.findOne({ _id: id }).exec();
        if (!user) throw new BadRequestException('user not found');

        const user_wallet = await this.wallet.findOne({ user: req.user.user_id }).exec();
        if(!user_wallet) throw new BadRequestException('wallet not found');

        const balance = user_wallet.balance;
        return {user, balance};
    }

    async makePayment(makePaymentDto: MakePaymentDto, @Req() req): Promise<{status: string, message: string, code: number, wallet: number}> {
        const formatTokenTime = new Date(req.user.exp * 1000);
        const token_expiry_time = moment(formatTokenTime).format();
        const now = moment().format()

        if (now > token_expiry_time) {
            throw new UnauthorizedException('Token has expired. Please log in again');
        }
        
        const available_services = ['AMAZON', 'NETFLIX', 'EBAY', 'JUMIA'];

        let { amount, service } = makePaymentDto;
        service = service.toUpperCase();

        if (!available_services.includes(service)) {
            throw new BadRequestException('service is not available');
        }
        const check_user_wallet = await this.wallet.findOne({ user: req.user.user_id }).exec();

        if (!check_user_wallet) throw new NotFoundException('user not found');
        const balance = check_user_wallet.balance;

        if (balance < amount) {
            throw new BadRequestException(
                'Your balance is not sufficient to make purchase. Please fund your account'
                );
        }

        // decrement user wallet
        await this.wallet.findOneAndUpdate(
            { check_user_wallet },
            { $inc: { balance: -amount } }
        ).exec();

        // transaction log
        await this.transaction.create(
            {
                wallet: check_user_wallet,
                amount,
                transaction_type: 'PAYMENT',
                service
            }
        );

        return {
            status: 'success',
            message: `Successully purchased goods of ${amount} from ${service}`, 
            wallet: balance,
            code: 200
        }

    }
}
