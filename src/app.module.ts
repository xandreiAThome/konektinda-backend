import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SuppliersModule } from './suppliers/suppliers.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [SuppliersModule, ProductsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
