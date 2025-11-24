import { Module } from '@nestjs/common';
import { UserAddressController } from './user_address.controller';
import { UserAddressService } from './user_address.service';

@Module({
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}
