# StockSage

StockSage is a comprehensive Inventory Management System being built with NestJS and TypeScript. The system aims to provide a complete solution for managing inventory, tracking stock levels, and handling product information through a modern RESTful API.

## 🚀 Features

### Currently Implemented
- **Product Management**
  - Complete CRUD operations
  - Basic product information tracking
  - RESTful API endpoints

### In Progress
- **Product Management**
  - SKU-based tracking
  - Price and quantity management
  - Category association
  - Stock level monitoring

- **Category Management**
  - Hierarchical organization
  - Product grouping
  - Category-based reporting
  - Empty category detection

- **Inventory Control**
  - Real-time stock tracking
  - Low stock alerts
  - Stock level history
  - Inventory reports

- **Search & Filtering**
  - Product search by name/SKU
  - Category-based filtering
  - Advanced search capabilities
  - Pagination support

## 🛠️ Technology Stack

- **Backend Framework:** NestJS
- **Language:** TypeScript
- **Database:** (To be implemented)
- **Build Tool:** pnpm
- **Key Libraries:**
  - NestJS Core
  - TypeScript
  - Class Validator
  - Class Transformer

## 📋 Prerequisites

- Node.js 16.x or higher
- pnpm
- (Database requirements to be added)

## 🔧 Setup & Installation

1. **Install Dependencies:**
   ```bash
   cd backend
   pnpm install
   ```

2. **Run the Application:**
   ```bash
   pnpm start:dev
   ```

3. **Access:**
   - API Base URL: http://localhost:3000/

## 📁 Project Structure

```
backend/
├── src/
│   ├── product/          # Product module
│   │   ├── product.controller.ts
│   │   ├── product.service.ts
│   │   ├── product.module.ts
│   │   └── product.entity.ts
│   ├── app.module.ts     # Root module
│   └── main.ts          # Application entry point
```

## 🔑 API Endpoints

### Products (Implemented)

- `GET /products` - List all products
- `POST /products` - Create new product
- `GET /products/:id` - Get product details
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Categories (Planned)

- `GET /categories` - List all categories
- `POST /categories` - Create new category
- `GET /categories/:id` - Get category details
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /categories/empty` - List empty categories

## 🚧 Project Status

This is an ongoing project. Currently, we have implemented the basic product management functionality with CRUD operations. The following features are planned for implementation:

1. Database integration
2. Category management
3. Inventory tracking
4. Search and filtering capabilities
5. Authentication and authorization
6. Input validation and error handling
7. Testing suite


**StockSage – Your Complete Inventory Solution (Under Development)**
