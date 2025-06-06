function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form.checkValidity()) {
    form.reportValidity();
    return false;
  }
  return true;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
}

function setQueryParams(params) {
  const url = new URL(window.location.href);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  window.history.pushState({}, "", url);
}

function removeQueryParams(params) {
  const url = new URL(window.location.href);
  params.forEach((param) => url.searchParams.delete(param));
  window.history.pushState({}, "", url);
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy text: ", err);
    return false;
  }
}

function downloadFile(content, fileName, contentType) {
  const blob = new Blob([content], { type: contentType });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

window.utils = {
  formatCurrency,
  formatDate,
  validateForm,
  debounce,
  throttle,
  generateId,
  deepClone,
  isEmpty,
  getQueryParams,
  setQueryParams,
  removeQueryParams,
  copyToClipboard,
  downloadFile,
};
