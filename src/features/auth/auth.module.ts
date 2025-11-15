import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/features/users/users.module';
import { FirebaseModule } from 'src/features/firebase/firebase.module';
import { CartsModule } from '../carts/carts.module';

@Module({
  imports: [UsersModule, FirebaseModule, CartsModule],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
