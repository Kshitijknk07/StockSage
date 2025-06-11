export interface Product {
  id: number;
  name: string;
  sku: string;
  description: string;
  quantity: number;
  price: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  products: Product[];
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}
