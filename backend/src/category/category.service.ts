import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { ResourceNotFoundException } from '../common/exceptions/not-found.exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepo.find();
  }

  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new ResourceNotFoundException('Category', id);
    return category;
  }

  async create(category: Omit<Category, 'id'>): Promise<Category> {
    const newCategory = this.categoryRepo.create(category);
    return this.categoryRepo.save(newCategory);
  }

  async update(id: number, updated: Partial<Category>): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new ResourceNotFoundException('Category', id);
    Object.assign(category, updated);
    return this.categoryRepo.save(category);
  }

  async remove(id: number): Promise<void> {
    const result = await this.categoryRepo.delete(id);
    if (result.affected === 0)
      throw new ResourceNotFoundException('Category', id);
  }

  async findEmpty(): Promise<Category[]> {
    return this.categoryRepo
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .where('product.id IS NULL')
      .getMany();
  }
}
