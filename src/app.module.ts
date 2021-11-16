/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { TransactionModule } from './transaction/transaction.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/fintech', {useUnifiedTopology: true, useNewUrlParser: true}),
    AuthModule,
    TransactionModule,
    ServicesModule
  ],
})
export class AppModule {}
