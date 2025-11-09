import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuppliersModule } from './features/suppliers/suppliers.module';
import { ProductsModule } from './features/products/products.module';
import { ProductCategoriesModule } from './features/product_categories/product_categories.module';
import { ProductVariantsModule } from './features/product_variants/product_variants.module';
import { SupplierOrdersModule } from './features/supplier_orders/supplier_orders.module';
import { OrdersModule } from './features/orders/orders.module';
import { CartsModule } from './features/carts/carts.module';
import { CartItemsModule } from './cart_items/cart_items.module';

@Module({
  imports: [
    SuppliersModule,
    ProductsModule,
    ProductCategoriesModule,
    ProductVariantsModule,
    SupplierOrdersModule,
    OrdersModule,
    CartsModule,
    CartItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
