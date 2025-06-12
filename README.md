# StockSage Backend API

StockSage is a robust inventory management system built with NestJS, TypeORM, and MySQL. This backend API provides comprehensive features for managing products, categories, and stock levels with detailed tracking and reporting capabilities.

## 🚀 Features

### 1. Product Management
- Create, read, update, and delete products
- Link products with categories
- Track product details (name, SKU, price, quantity)
- Automatic stock history tracking
- Low stock alerts

### 2. Category Management
- Create, read, update, and delete categories
- Track empty categories
- Associate products with categories

### 3. Advanced Search & Filtering
- Search products by name or SKU
- Filter products by category
- Pagination support
- Sort results

### 4. Stock Management
- Real-time stock level tracking
- Stock history with audit trail
- Low stock alerts with configurable thresholds
- Automatic stock change logging

### 5. Error Handling
- Consistent error response format
- Detailed error messages
- Resource not found handling
- Validation error handling

## 🛠️ Technology Stack

- **Framework**: NestJS
- **Database**: MySQL
- **ORM**: TypeORM
- **Validation**: class-validator, class-transformer
- **Package Manager**: pnpm
- **Configuration**: @nestjs/config

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- pnpm (v7 or higher)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/StockSage.git
   cd StockSage/backend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_DATABASE=your_db_name
   ```

   > ⚠️ **Important**: Never commit the `.env` file to version control. The `.env.example` file is provided as a template.

4. **Set up the database**
   ```sql
   CREATE DATABASE your_db_name;
   CREATE USER 'your_db_username'@'localhost' IDENTIFIED BY 'your_db_password';
   GRANT ALL PRIVILEGES ON your_db_name.* TO 'your_db_username'@'localhost';
   FLUSH PRIVILEGES;
   ```

5. **Start the development server**
   ```bash
   pnpm start:dev
   ```

## 📚 API Documentation

### Products

#### Get All Products
```http
GET /products
```
Query Parameters:
- `query`: Search term for name/SKU
- `categoryId`: Filter by category
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

#### Get Product by ID
```http
GET /products/:id
```

#### Create Product
```http
POST /products
```
Request Body:
```json
{
  "name": "Product Name",
  "sku": "SKU123",
  "price": 99.99,
  "quantity": 10,
  "categoryId": 1
}
```

#### Update Product
```http
PUT /products/:id
```
Request Body:
```json
{
  "name": "Updated Name",
  "price": 89.99,
  "quantity": 5,
  "categoryId": 2
}
```

#### Delete Product
```http
DELETE /products/:id
```

#### Get Low Stock Products
```http
GET /products/low-stock
```
Query Parameters:
- `threshold`: Minimum stock level (default: 5)

#### Get Product Stock History
```http
GET /products/:id/stock-history
```

### Categories

#### Get All Categories
```http
GET /categories
```

#### Get Category by ID
```http
GET /categories/:id
```

#### Create Category
```http
POST /categories
```
Request Body:
```json
{
  "name": "Category Name",
  "description": "Category Description"
}
```

#### Update Category
```http
PUT /categories/:id
```
Request Body:
```json
{
  "name": "Updated Name",
  "description": "Updated Description"
}
```

#### Delete Category
```http
DELETE /categories/:id
```

#### Get Empty Categories
```http
GET /categories/empty
```

## 🔍 Error Handling

The API uses a consistent error response format:

```json
{
  "statusCode": 404,
  "message": "Product with ID 123 not found",
  "error": "Not Found",
  "resource": "Product",
  "resourceId": 123,
  "timestamp": "2024-03-14T12:00:00.000Z",
  "path": "/products/123"
}
```

Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `404`: Not Found
- `500`: Internal Server Error

## 📊 Database Schema

### Product
```sql
CREATE TABLE product (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(255) NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES category(id)
);
```

### Category
```sql
CREATE TABLE category (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT
);
```

### Stock History
```sql
CREATE TABLE stock_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  previous_quantity INT NOT NULL,
  new_quantity INT NOT NULL,
  quantity_change INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE
);
```

## 🔐 Security

- Input validation using class-validator
- SQL injection prevention through TypeORM
- Error message sanitization in production
- Environment variable protection
- Secure database credentials management

## 🧪 Testing

Run the test suite:
```bash
# Unit tests
pnpm test

# e2e tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

## 📦 Production Deployment

1. Set up production environment variables:
   ```env
   NODE_ENV=production
   PORT=3000
   DB_HOST=your_production_host
   DB_PORT=3306
   DB_USERNAME=your_production_username
   DB_PASSWORD=your_production_password
   DB_DATABASE=your_production_database
   ```

2. Build the application:
   ```bash
   pnpm build
   ```

3. Start the production server:
   ```bash
   pnpm start:prod
   ```

## 🙏 Acknowledgments

- NestJS team for the amazing framework
- TypeORM team for the powerful ORM
