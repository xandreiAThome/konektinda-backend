import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductsModule } from './products/products.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { SupplierOrdersModule } from './features/supplier_orders/supplier_orders.module';
import { OrdersModule } from './features/orders/orders.module';

@Module({
  imports: [
    SuppliersModule,
    ProductsModule,
    ProductCategoriesModule,
    ProductVariantsModule,
    SupplierOrdersModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
