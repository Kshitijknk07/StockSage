class ValidationService {
  constructor() {
    this.rules = config.validation;
  }

  validateProduct(product) {
    const errors = {};

    if (this.rules.product.name.required && !product.name) {
      errors.name = this.formatMessage(config.messages.errors.required);
    } else if (product.name) {
      if (product.name.length < this.rules.product.name.minLength) {
        errors.name = this.formatMessage(
          config.messages.errors.minLength,
          this.rules.product.name.minLength
        );
      } else if (product.name.length > this.rules.product.name.maxLength) {
        errors.name = this.formatMessage(
          config.messages.errors.maxLength,
          this.rules.product.name.maxLength
        );
      }
    }

    if (this.rules.product.price.required && !product.price) {
      errors.price = this.formatMessage(config.messages.errors.required);
    } else if (product.price !== undefined) {
      const price = parseFloat(product.price);
      if (isNaN(price)) {
        errors.price = this.formatMessage(config.messages.errors.invalidFormat);
      } else if (price < this.rules.product.price.min) {
        errors.price = this.formatMessage(
          config.messages.errors.min,
          this.rules.product.price.min
        );
      } else if (price > this.rules.product.price.max) {
        errors.price = this.formatMessage(
          config.messages.errors.max,
          this.rules.product.price.max
        );
      }
    }

    if (this.rules.product.stockLevel.required && !product.stockLevel) {
      errors.stockLevel = this.formatMessage(config.messages.errors.required);
    } else if (product.stockLevel !== undefined) {
      const stockLevel = parseInt(product.stockLevel);
      if (isNaN(stockLevel)) {
        errors.stockLevel = this.formatMessage(
          config.messages.errors.invalidFormat
        );
      } else if (stockLevel < this.rules.product.stockLevel.min) {
        errors.stockLevel = this.formatMessage(
          config.messages.errors.min,
          this.rules.product.stockLevel.min
        );
      } else if (stockLevel > this.rules.product.stockLevel.max) {
        errors.stockLevel = this.formatMessage(
          config.messages.errors.max,
          this.rules.product.stockLevel.max
        );
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  validateCategory(category) {
    const errors = {};

    if (this.rules.category.name.required && !category.name) {
      errors.name = this.formatMessage(config.messages.errors.required);
    } else if (category.name) {
      if (category.name.length < this.rules.category.name.minLength) {
        errors.name = this.formatMessage(
          config.messages.errors.minLength,
          this.rules.category.name.minLength
        );
      } else if (category.name.length > this.rules.category.name.maxLength) {
        errors.name = this.formatMessage(
          config.messages.errors.maxLength,
          this.rules.category.name.maxLength
        );
      }
    }

    if (
      category.description &&
      category.description.length > this.rules.category.description.maxLength
    ) {
      errors.description = this.formatMessage(
        config.messages.errors.maxLength,
        this.rules.category.description.maxLength
      );
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  formatMessage(message, ...args) {
    return message.replace(/{(\d+)}/g, (match, index) => args[index] || match);
  }

  showValidationErrors(formId, errors) {
    const form = document.getElementById(formId);
    const inputs = form.querySelectorAll("input, select, textarea");

    form.querySelectorAll(".invalid-feedback").forEach((el) => el.remove());
    inputs.forEach((input) => input.classList.remove("is-invalid"));

    Object.entries(errors).forEach(([field, message]) => {
      const input = form.querySelector(`[name="${field}"]`);
      if (input) {
        input.classList.add("is-invalid");
        const feedback = document.createElement("div");
        feedback.className = "invalid-feedback";
        feedback.textContent = message;
        input.parentNode.appendChild(feedback);
      }
    });
  }
}

const validationService = new ValidationService();
