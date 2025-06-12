import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { LowStockDto } from './dto/low-stock.dto';
import { StockHistory } from './stock-history.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(@Query() searchDto: SearchProductsDto) {
    return this.productService.findAll(searchDto);
  }

  @Get('search')
  async search(@Query() searchDto: SearchProductsDto) {
    return this.productService.findAll(searchDto);
  }

  @Get('low-stock')
  async getLowStock(@Query() lowStockDto: LowStockDto) {
    return this.productService.findLowStock(lowStockDto);
  }

  @Get(':id/stock-history')
  async getStockHistory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StockHistory[]> {
    return this.productService.getStockHistory(id);
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.productService.findOne(id);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productService.create(createProductDto);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.remove(id);
  }
}
