/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/schema/user.schema';
import { Wallet, WalletSchema } from 'src/auth/schema/wallet.schema';
import { TransactionModule } from 'src/transaction/transaction.module';
import { Transaction, TransactionSchema } from 'src/transaction/transaction.schema';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

@Module({
  imports: [
    TransactionModule,
    AuthModule,
    MongooseModule.forFeature([
      {name: Wallet.name, schema: WalletSchema},
      {name: Transaction.name, schema: TransactionSchema},
      {name: User.name, schema: UserSchema}
    ])
  ],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
