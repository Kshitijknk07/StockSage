import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/category.entity';
import { StockHistory } from './product/stock-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [Product, Category, StockHistory],
        synchronize: configService.get('NODE_ENV') === 'development', // auto-create tables (disable in prod)
      }),
      inject: [ConfigService],
    }),
    ProductModule,
    CategoryModule,
  ],
})
export class AppModule {}
