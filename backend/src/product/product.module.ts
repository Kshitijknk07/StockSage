import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { Category } from '../category/category.entity';
import { StockHistory } from './stock-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, StockHistory])],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
