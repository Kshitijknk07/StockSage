import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../category/category.entity';
import { StockHistory } from './stock-history.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductsDto } from './dto/search-products.dto';
import { LowStockDto } from './dto/low-stock.dto';
import { ResourceNotFoundException } from '../common/exceptions/not-found.exception';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectRepository(StockHistory)
    private readonly stockHistoryRepo: Repository<StockHistory>,
  ) {}

  async findAll(searchDto: SearchProductsDto) {
    const { query, categoryId, page = 1, limit = 10 } = searchDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category');

    if (query) {
      queryBuilder.where(
        '(product.name LIKE :query OR product.sku LIKE :query)',
        { query: `%${query}%` },
      );
    }

    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }

    const [products, total] = await queryBuilder
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findLowStock(lowStockDto: LowStockDto) {
    const { threshold = 5 } = lowStockDto;

    const products = await this.productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.quantity < :threshold', { threshold })
      .orderBy('product.quantity', 'ASC')
      .getMany();

    return {
      data: products,
      meta: {
        total: products.length,
        threshold,
      },
    };
  }

  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new ResourceNotFoundException('Product', id);
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const category = await this.categoryRepo.findOneBy({
      id: createProductDto.categoryId,
    });
    if (!category)
      throw new ResourceNotFoundException(
        'Category',
        createProductDto.categoryId,
      );

    const newProduct = this.productRepo.create({
      ...createProductDto,
      category,
    });
    const savedProduct = await this.productRepo.save(newProduct);

    // Log initial stock
    await this.stockHistoryRepo.save({
      product_id: savedProduct.id,
      previous_quantity: 0,
      new_quantity: savedProduct.quantity,
      quantity_change: savedProduct.quantity,
    });

    return savedProduct;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id });
    if (!product) throw new ResourceNotFoundException('Product', id);

    if (updateProductDto.categoryId) {
      const category = await this.categoryRepo.findOneBy({
        id: updateProductDto.categoryId,
      });
      if (!category)
        throw new ResourceNotFoundException(
          'Category',
          updateProductDto.categoryId,
        );
      product.category = category;
    }

    const previousQuantity = product.quantity;
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepo.save(product);

    // Log stock change if quantity was updated
    if (updateProductDto.quantity !== undefined) {
      await this.stockHistoryRepo.save({
        product_id: updatedProduct.id,
        previous_quantity: previousQuantity,
        new_quantity: updatedProduct.quantity,
        quantity_change: updatedProduct.quantity - previousQuantity,
      });
    }

    return updatedProduct;
  }

  async remove(id: number): Promise<void> {
    const result = await this.productRepo.delete(id);
    if (result.affected === 0)
      throw new ResourceNotFoundException('Product', id);
  }

  async getStockHistory(productId: number) {
    const product = await this.productRepo.findOneBy({ id: productId });
    if (!product) throw new ResourceNotFoundException('Product', productId);

    return this.stockHistoryRepo.find({
      where: { product_id: productId },
      order: { created_at: 'DESC' },
    });
  }
}
