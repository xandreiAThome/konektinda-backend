import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/user/users.module';
import { FirebaseModule } from 'src/firebase/firebase.module';

@Module({
  imports: [UsersModule, FirebaseModule],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
