const API_BASE_URL = config.api.baseUrl;
const PRODUCTS_API = `${API_BASE_URL}${config.api.endpoints.products}`;
const CATEGORIES_API = `${API_BASE_URL}${config.api.endpoints.categories}`;

let currentView = "dashboard";
let products = [];
let categories = [];

document.addEventListener("DOMContentLoaded", () => {
  loadDashboard();
  setupEventListeners();
});

function setupEventListeners() {}

function showDashboard() {
  hideAllSections();
  document.getElementById("dashboard").style.display = "block";
  currentView = "dashboard";
  loadDashboard();
}

function showProducts() {
  hideAllSections();
  document.getElementById("products").style.display = "block";
  currentView = "products";
  loadProducts();
}

function showCategories() {
  hideAllSections();
  document.getElementById("categories").style.display = "block";
  currentView = "categories";
  loadCategories();
}

function showReports() {
  hideAllSections();
  document.getElementById("reports").style.display = "block";
  currentView = "reports";
  loadReports();
}

function hideAllSections() {
  ["dashboard", "products", "categories", "reports"].forEach((section) => {
    document.getElementById(section).style.display = "none";
  });
}

async function loadDashboard() {
  loadingIndicator.show();
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch(PRODUCTS_API),
      fetch(CATEGORIES_API),
    ]);

    if (!productsResponse.ok || !categoriesResponse.ok) {
      throw new Error(config.messages.errors.serverError);
    }

    const products = await productsResponse.json();
    const categories = await categoriesResponse.json();

    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("totalCategories").textContent = categories.length;
    document.getElementById("lowStockItems").textContent = products.filter(
      (p) => p.stockLevel < 10
    ).length;
  } catch (error) {
    console.error("Error loading dashboard:", error);
    errorHandler.showError(config.messages.errors.serverError);
  } finally {
    loadingIndicator.hide();
  }
}

async function loadProducts() {
  loadingIndicator.show();
  try {
    const response = await fetch(PRODUCTS_API);
    if (!response.ok) {
      throw new Error(config.messages.errors.serverError);
    }
    products = await response.json();
    renderProductsTable();
  } catch (error) {
    console.error("Error loading products:", error);
    errorHandler.showError(config.messages.errors.serverError);
  } finally {
    loadingIndicator.hide();
  }
}

async function loadCategories() {
  loadingIndicator.show();
  try {
    const response = await fetch(CATEGORIES_API);
    if (!response.ok) {
      throw new Error(config.messages.errors.serverError);
    }
    categories = await response.json();
    renderCategoriesTable();
  } catch (error) {
    console.error("Error loading categories:", error);
    errorHandler.showError(config.messages.errors.serverError);
  } finally {
    loadingIndicator.hide();
  }
}

async function loadReports() {
  loadingIndicator.show();
  try {
    const [productsResponse, categoriesResponse] = await Promise.all([
      fetch(PRODUCTS_API),
      fetch(CATEGORIES_API),
    ]);

    if (!productsResponse.ok || !categoriesResponse.ok) {
      throw new Error(config.messages.errors.serverError);
    }

    const products = await productsResponse.json();
    const categories = await categoriesResponse.json();

    renderStockLevelChart(products);
    renderCategoryChart(categories);
  } catch (error) {
    console.error("Error loading reports:", error);
    errorHandler.showError(config.messages.errors.serverError);
  } finally {
    loadingIndicator.hide();
  }
}

function renderProductsTable() {
  const tbody = document.getElementById("productsTableBody");
  tbody.innerHTML = "";

  products.forEach((product) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.categoryId)}</td>
            <td>${product.stockLevel}</td>
            <td>${utils.formatCurrency(product.price)}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editProduct(${
                  product.id
                })">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteProduct(${
                  product.id
                })">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function renderCategoriesTable() {
  const tbody = document.getElementById("categoriesTableBody");
  tbody.innerHTML = "";

  categories.forEach((category) => {
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${category.id}</td>
            <td>${category.name}</td>
            <td>${category.description || ""}</td>
            <td>
                <button class="btn btn-sm btn-primary" onclick="editCategory(${
                  category.id
                })">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteCategory(${
                  category.id
                })">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

function renderStockLevelChart(products) {
  const ctx = document.getElementById("stockLevelChart").getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: products.map((p) => p.name),
      datasets: [
        {
          label: "Stock Level",
          data: products.map((p) => p.stockLevel),
          backgroundColor: config.ui.charts.colors[1],
          borderColor: config.ui.charts.colors[1].replace("0.5", "1"),
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function renderCategoryChart(categories) {
  const ctx = document.getElementById("categoryChart").getContext("2d");
  const productCounts = categories.map(
    (cat) => products.filter((p) => p.categoryId === cat.id).length
  );

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: categories.map((c) => c.name),
      datasets: [
        {
          data: productCounts,
          backgroundColor: config.ui.charts.colors,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
}

function showAddProductModal() {
  const modal = new bootstrap.Modal(document.getElementById("addProductModal"));
  populateCategorySelect();
  modal.show();
}

function showAddCategoryModal() {
  const modal = new bootstrap.Modal(
    document.getElementById("addCategoryModal")
  );
  modal.show();
}

function populateCategorySelect() {
  const select = document.querySelector(
    '#addProductForm select[name="categoryId"]'
  );
  select.innerHTML = categories
    .map((cat) => `<option value="${cat.id}">${cat.name}</option>`)
    .join("");
}

async function saveProduct(event) {
  event.preventDefault();

  const form = document.getElementById("addProductForm");
  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());

  const validation = validationService.validateProduct(product);
  if (!validation.isValid) {
    validationService.showValidationErrors("addProductForm", validation.errors);
    return;
  }

  try {
    const response = await fetch(PRODUCTS_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    if (!response.ok) {
      throw new Error(config.messages.errors.serverError);
    }

    const savedProduct = await response.json();
    products.push(savedProduct);
    renderProductsTable();

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addProductModal")
    );
    modal.hide();
    showToast(config.messages.success.productAdded);

    form.reset();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function saveCategory(event) {
  event.preventDefault();

  const form = document.getElementById("addCategoryForm");
  const formData = new FormData(form);
  const category = Object.fromEntries(formData.entries());

  const validation = validationService.validateCategory(category);
  if (!validation.isValid) {
    validationService.showValidationErrors(
      "addCategoryForm",
      validation.errors
    );
    return;
  }

  try {
    const response = await fetch(CATEGORIES_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(category),
    });

    if (!response.ok) {
      throw new Error(config.messages.errors.serverError);
    }

    const savedCategory = await response.json();
    categories.push(savedCategory);
    renderCategoriesTable();

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addCategoryModal")
    );
    modal.hide();
    showToast(config.messages.success.categoryAdded);

    form.reset();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function deleteProduct(id) {
  if (!confirm(config.messages.confirm.delete)) return;

  loadingIndicator.show();
  try {
    const response = await fetch(`${PRODUCTS_API}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(config.messages.errors.serverError);
    }

    await loadProducts();
    await loadDashboard();
    errorHandler.showSuccess(config.messages.success.deleted);
  } catch (error) {
    console.error("Error deleting product:", error);
    errorHandler.showError(config.messages.errors.serverError);
  } finally {
    loadingIndicator.hide();
  }
}

async function deleteCategory(id) {
  if (!confirm(config.messages.confirm.delete)) return;

  loadingIndicator.show();
  try {
    const response = await fetch(`${CATEGORIES_API}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(config.messages.errors.serverError);
    }

    await loadCategories();
    await loadDashboard();
    errorHandler.showSuccess(config.messages.success.deleted);
  } catch (error) {
    console.error("Error deleting category:", error);
    errorHandler.showError(config.messages.errors.serverError);
  } finally {
    loadingIndicator.hide();
  }
}

function getCategoryName(categoryId) {
  const category = categories.find((c) => c.id === categoryId);
  return category ? category.name : "Unknown";
}
