import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductsModule } from './products/products.module';
import { ProductCategoriesModule } from './product_categories/product_categories.module';
import { ProductVariantsModule } from './product_variants/product_variants.module';

@Module({
  imports: [SuppliersModule, ProductsModule, ProductCategoriesModule, ProductVariantsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
