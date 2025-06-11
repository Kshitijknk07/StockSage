import axios from "axios";
import type { Product, Category, ApiResponse } from "../types";

const API_URL = "http://localhost:8080/inventory-management/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const productApi = {
  getAll: () => api.get<ApiResponse<Product[]>>("/products"),
  getById: (id: number) => api.get<ApiResponse<Product>>(`/products/${id}`),
  create: (product: Omit<Product, "id" | "createdAt" | "updatedAt">) =>
    api.post<ApiResponse<Product>>("/products", product),
  update: (id: number, product: Partial<Product>) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, product),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/products/${id}`),
};

export const categoryApi = {
  getAll: () => api.get<ApiResponse<Category[]>>("/categories"),
  getById: (id: number) => api.get<ApiResponse<Category>>(`/categories/${id}`),
  create: (category: Omit<Category, "id" | "products">) =>
    api.post<ApiResponse<Category>>("/categories", category),
  update: (id: number, category: Partial<Category>) =>
    api.put<ApiResponse<Category>>(`/categories/${id}`, category),
  delete: (id: number) => api.delete<ApiResponse<void>>(`/categories/${id}`),
};
