# StockSage

StockSage is a robust, scalable Inventory Management System built with Spring MVC, Hibernate, and MySQL. It provides a comprehensive solution for managing inventory, tracking stock levels, handling product and category information, and includes a modern RESTful API for integration.

---

## 🚀 Features

- Product & Category Management (CRUD)
- Real-time Inventory Tracking
- Product Search by Name or Category
- Stock Level Alerts
- Inventory Reports (API)
- RESTful API Endpoints
- Secure Database Operations
- Modern Web Interface (HTML/CSS/JS)
- Logging & Audit Trail

---

## 🛠️ Technology Stack

- **Backend:** Spring MVC 5.3.x
- **ORM:** Hibernate 5.6.x
- **Database:** MySQL 8.0+
- **Build Tool:** Maven
- **Java Version:** 1.8+
- **Other Libraries:**
  - Spring Data JPA
  - Jackson (JSON)
  - Lombok
  - Logback

---

## 📋 Prerequisites

- JDK 1.8 or higher
- Maven 3.x
- MySQL 8.0+
- Servlet Container (Tomcat 9.x recommended)

---

## 🔧 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd StockSage/project
   ```
2. **Configure the database:**
   - Create a MySQL database (e.g., `stocksage`)
   - Update `src/main/resources/application.properties` with your DB credentials
3. **Build the project:**
   ```bash
   mvn clean install
   ```
4. **Deploy:**
   - Deploy the generated `inventory-management.war` from `target/` to your Tomcat `webapps/` directory
5. **Access the app:**
   - Open [http://localhost:8080/inventory-management/](http://localhost:8080/inventory-management/) in your browser

---

## 📁 Project Structure

```
src/main/
├── java/com/inventory/
│   ├── config/         # Spring config
│   ├── controller/    # REST controllers
│   ├── model/         # JPA entities
│   ├── repository/    # Spring Data JPA repos
│   └── service/       # Business logic
└── webapp/            # Web resources (HTML, JSP, etc.)
```

---

## 🔑 Configuration

- **Spring MVC** for web/API layer
- **Hibernate** for ORM
- **MySQL** for database
- **Logback** for logging

---

## 🚀 Usage

1. Start MySQL and ensure your DB is ready
2. Deploy the WAR to Tomcat and start the server
3. Use a browser or API client (e.g., Postman) to interact with endpoints:
   - Products: `/api/products`
   - Categories: `/api/categories`
   - Product Search: `/api/products/search?keyword=...`
   - Product Search by Category: `/api/products/searchByCategory?category=...`

---

## 🔒 Security

- Input validation
- SQL injection prevention (via JPA)
- XSS protection (for web UI)
- CSRF protection (if using forms)
- Role-based access (extendable)

---

## 📊 Logging

- Logback for console & file logging
- Log rotation
- Audit logging for inventory changes

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License.

---

**StockSage – Inventory made simple.**
