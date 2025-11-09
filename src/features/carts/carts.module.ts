import { Module } from '@nestjs/common';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  controllers: [CartsController],
  providers: [CartsService],
  imports: [FirebaseModule],
})
export class CartsModule {}
