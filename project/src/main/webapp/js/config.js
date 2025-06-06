const config = {
  api: {
    baseUrl: "/inventory-management/api",
    endpoints: {
      products: "/products",
      categories: "/categories",
    },
    timeout: 30000,
    retryAttempts: 3,
  },

  ui: {
    theme: "light",
    language: "en",
    dateFormat: "MMM DD, YYYY",
    currency: {
      code: "USD",
      symbol: "$",
      locale: "en-US",
    },
    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
    },
    charts: {
      colors: [
        "rgba(255, 99, 132, 0.5)",
        "rgba(54, 162, 235, 0.5)",
        "rgba(255, 206, 86, 0.5)",
        "rgba(75, 192, 192, 0.5)",
        "rgba(153, 102, 255, 0.5)",
      ],
    },
  },

  features: {
    enableSearch: true,
    enableFiltering: true,
    enableSorting: true,
    enableExport: true,
    enableImport: true,
    enableBulkActions: true,
  },

  validation: {
    product: {
      name: {
        required: true,
        minLength: 3,
        maxLength: 100,
      },
      price: {
        required: true,
        min: 0,
        max: 999999.99,
      },
      stockLevel: {
        required: true,
        min: 0,
        max: 999999,
      },
    },
    category: {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      description: {
        required: false,
        maxLength: 500,
      },
    },
  },

  messages: {
    errors: {
      required: "This field is required",
      minLength: "Minimum length is {0} characters",
      maxLength: "Maximum length is {0} characters",
      min: "Minimum value is {0}",
      max: "Maximum value is {0}",
      invalidFormat: "Invalid format",
      serverError: "Server error occurred",
      networkError: "Network error occurred",
      unknownError: "An unknown error occurred",
    },
    success: {
      saved: "Saved successfully",
      deleted: "Deleted successfully",
      updated: "Updated successfully",
    },
    confirm: {
      delete: "Are you sure you want to delete this item?",
      bulkDelete: "Are you sure you want to delete {0} items?",
    },
  },
};

window.config = config;
