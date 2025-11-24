import { Module } from '@nestjs/common';
import { UserAddressController } from './user_address.controller';
import { UserAddressService } from './user_address.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}
