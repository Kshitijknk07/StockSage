import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  private products: Product[] = [];
  private idCounter = 1;

  findAll(): Product[] {
    return this.products;
  }

  findOne(id: number): Product {
    const product = this.products.find((p) => p.id === id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(product: Omit<Product, 'id'>): Product {
    const newProduct = { id: this.idCounter++, ...product };
    this.products.push(newProduct);
    return newProduct;
  }

  update(id: number, updated: Partial<Product>): Product {
    const product = this.findOne(id);
    Object.assign(product, updated);
    return product;
  }

  remove(id: number): void {
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) throw new NotFoundException('Product not found');
    this.products.splice(index, 1);
  }
}
