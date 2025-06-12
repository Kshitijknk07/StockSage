import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
  ) {}

  create(category: Partial<Category>) {
    const newCategory = this.categoryRepo.create(category);
    return this.categoryRepo.save(newCategory);
  }

  findAll() {
    return this.categoryRepo.find();
  }

  findOne(id: number) {
    return this.categoryRepo.findOneBy({ id });
  }

  async update(id: number, data: Partial<Category>) {
    await this.categoryRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepo.remove(category);
  }
}
