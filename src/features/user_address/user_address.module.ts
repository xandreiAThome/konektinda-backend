import { Module } from '@nestjs/common';
import { UserAddressController } from './user_address.controller';
import { UserAddressService } from './user_address.service';
import { UsersModule } from '../users/users.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [UsersModule, FirebaseModule],
  controllers: [UserAddressController],
  providers: [UserAddressService],
})
export class UserAddressModule {}
