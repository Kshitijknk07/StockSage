import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity()
export class StockHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column()
  product_id: number;

  @Column('int')
  previous_quantity: number;

  @Column('int')
  new_quantity: number;

  @Column('int')
  quantity_change: number;

  @CreateDateColumn()
  created_at: Date;
}
