import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductsModule } from './products/products.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [SuppliersModule, ProductsModule, FirebaseModule, AuthModule, UsersModule, 
    ConfigModule.forRoot({ isGlobal: true}),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
