# StockSage

StockSage is a comprehensive Inventory Management System built with Spring MVC, Hibernate, and MySQL. The system provides a complete solution for managing inventory, tracking stock levels, and handling product and category information through a modern RESTful API.

## 🚀 Features

- **Product Management**

  - Complete CRUD operations
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

- **Backend Framework:** Spring MVC 5.3.x
- **ORM:** Hibernate 5.6.x
- **Database:** MySQL 8.0+
- **Build Tool:** Maven
- **Java Version:** 1.8+
- **Key Libraries:**
  - Spring Data JPA
  - Jackson (JSON)
  - Lombok
  - Logback

## 📋 Prerequisites

- JDK 1.8 or higher
- Maven 3.x
- MySQL 8.0+
- Tomcat 9.x

## 🔧 Setup & Installation

1. **Database Setup:**

   ```bash
   # Create MySQL database
   CREATE DATABASE stocksage;
   ```

2. **Configuration:**

   - Update `src/main/resources/application.properties` with your database credentials
   - Configure logging in `logback.xml` if needed

3. **Build & Deploy:**

   ```bash
   # Build the project
   mvn clean install

   # Deploy to Tomcat
   # Copy target/inventory-management.war to Tomcat's webapps directory
   ```

4. **Access:**
   - Web Interface: http://localhost:8080/inventory-management/
   - API Base URL: http://localhost:8080/inventory-management/api/

## 📁 Project Structure

```
src/main/
├── java/com/inventory/
│   ├── config/         # Spring configuration
│   ├── controller/     # REST controllers
│   ├── model/         # JPA entities
│   ├── repository/    # Data repositories
│   └── service/       # Business logic
└── webapp/            # Web resources
```

## 🔑 API Endpoints

### Products

- `GET /api/products` - List all products
- `POST /api/products` - Create new product
- `GET /api/products/{id}` - Get product details
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product
- `GET /api/products/search` - Search products
- `GET /api/products/low-stock` - Get low stock products

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/{id}` - Get category details
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category
- `GET /api/categories/empty` - List empty categories

## 📊 Logging & Monitoring

- Comprehensive logging with Logback
- Audit trail for inventory changes
- Performance monitoring
- Error tracking and reporting

## 🔒 Security Features

- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure database operations

---

**StockSage – Your Complete Inventory Solution**
