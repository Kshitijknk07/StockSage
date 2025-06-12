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
import { CategoryService } from './category.service';
import { Category } from './category.entity';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get('empty')
  async getEmpty(): Promise<Category[]> {
    return this.categoryService.findEmpty();
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Post()
  async create(@Body() category: Omit<Category, 'id'>): Promise<Category> {
    return this.categoryService.create(category);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() category: Partial<Category>,
  ): Promise<Category> {
    return this.categoryService.update(id, category);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.remove(id);
  }
}
