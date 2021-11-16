/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/schema/user.schema';
import { FundDto } from './dto/fund.dto';
import { MakePaymentDto } from './dto/pay-for-service.dto';
import { ServicesService } from './services.service';

@Controller('/api/v1/services')
@UseGuards(AuthGuard())
export class ServicesController {
    constructor(private servicesService: ServicesService) {}

    @Post('/fund-account')
    async fund(@Body() fundDto: FundDto, @Req() req): Promise<{status: string, message: string, code: number}> {
        return this.servicesService.fund(fundDto, req);
    }

    @Get('/user-details/:id')
    async userDetails(@Param('id') id: string, @Req() req): Promise<{user: User, balance: number}> {
        return this.servicesService.userDetails(id, req);
    }

    @Post('/make-payment')
    async makePayment(@Body() makePaymentDto: MakePaymentDto, @Req() req): Promise<{status: string, message: string, code: number, wallet: number}> {
        return this.servicesService.makePayment(makePaymentDto, req);
    }
}