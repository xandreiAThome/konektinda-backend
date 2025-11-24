import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuppliersModule } from './features/suppliers/suppliers.module';
import { ProductsModule } from './features/products/products.module';
import { SupplierOrdersModule } from './features/supplier_orders/supplier_orders.module';
import { OrdersModule } from './features/orders/orders.module';
import { ProductCategoriesModule } from './features/product_categories/product_categories.module';
import { ProductVariantsModule } from './features/product_variants/product_variants.module';
import { FirebaseModule } from './features/firebase/firebase.module';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CartsModule } from './features/carts/carts.module';
import { UserAddressModule } from './features/user_address/user_address.module';

@Module({
  imports: [
    SuppliersModule,
    ProductsModule,
    ProductCategoriesModule,
    ProductVariantsModule,
    SupplierOrdersModule,
    OrdersModule,
    FirebaseModule,
    AuthModule,
    UsersModule,
    CartsModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UserAddressModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
