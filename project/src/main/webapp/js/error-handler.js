class ErrorHandler {
  constructor() {
    this.errorContainer = null;
    this.initialize();
  }

  initialize() {
    if (!document.getElementById("errorContainer")) {
      this.errorContainer = document.createElement("div");
      this.errorContainer.id = "errorContainer";
      this.errorContainer.className = "position-fixed top-0 end-0 p-3";
      this.errorContainer.style.zIndex = "1050";
      document.body.appendChild(this.errorContainer);
    } else {
      this.errorContainer = document.getElementById("errorContainer");
    }
  }

  showError(message, type = "error") {
    const alertId = `alert-${Date.now()}`;
    const alert = document.createElement("div");
    alert.id = alertId;
    alert.className = `alert alert-${
      type === "error" ? "danger" : "warning"
    } alert-dismissible fade show`;
    alert.role = "alert";

    alert.innerHTML = `
            <strong>${
              type === "error" ? "Error" : "Warning"
            }!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

    this.errorContainer.appendChild(alert);

    setTimeout(() => {
      const alertElement = document.getElementById(alertId);
      if (alertElement) {
        const bsAlert = new bootstrap.Alert(alertElement);
        bsAlert.close();
      }
    }, 5000);
  }

  showSuccess(message) {
    const alertId = `alert-${Date.now()}`;
    const alert = document.createElement("div");
    alert.id = alertId;
    alert.className = "alert alert-success alert-dismissible fade show";
    alert.role = "alert";

    alert.innerHTML = `
            <strong>Success!</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;

    this.errorContainer.appendChild(alert);

    setTimeout(() => {
      const alertElement = document.getElementById(alertId);
      if (alertElement) {
        const bsAlert = new bootstrap.Alert(alertElement);
        bsAlert.close();
      }
    }, 3000);
  }

  clearErrors() {
    this.errorContainer.innerHTML = "";
  }
}

const errorHandler = new ErrorHandler();
