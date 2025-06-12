import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'stocksage_user',
      password: 'Stocksage@123',
      database: 'stocksage',
      entities: [Product],
      synchronize: true, // auto-create tables (disable in prod)
    }),
    ProductModule,
    CategoryModule,
  ],
})
export class AppModule {}
