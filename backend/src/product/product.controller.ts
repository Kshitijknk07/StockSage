import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  getAll(): Product[] {
    return this.productService.findAll();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number): Product {
    return this.productService.findOne(id);
  }

  @Post()
  create(@Body() body: Omit<Product, 'id'>): Product {
    return this.productService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: Partial<Product>,
  ): Product {
    return this.productService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): void {
    return this.productService.remove(id);
  }
}
