class LoadingIndicator {
  constructor() {
    this.loadingContainer = null;
    this.initialize();
  }

  initialize() {
    if (!document.getElementById("loadingContainer")) {
      this.loadingContainer = document.createElement("div");
      this.loadingContainer.id = "loadingContainer";
      this.loadingContainer.className =
        "position-fixed top-0 start-0 w-100 h-100 d-none";
      this.loadingContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      this.loadingContainer.style.zIndex = "1060";

      const spinner = document.createElement("div");
      spinner.className =
        "position-absolute top-50 start-50 translate-middle text-white text-center";
      spinner.innerHTML = `
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="mt-2">Loading...</div>
            `;

      this.loadingContainer.appendChild(spinner);
      document.body.appendChild(this.loadingContainer);
    } else {
      this.loadingContainer = document.getElementById("loadingContainer");
    }
  }

  show() {
    this.loadingContainer.classList.remove("d-none");
  }

  hide() {
    this.loadingContainer.classList.add("d-none");
  }
}

const loadingIndicator = new LoadingIndicator();
