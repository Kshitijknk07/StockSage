import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductList } from "@/components/products/ProductList";
import { ProductForm } from "@/components/products/ProductForm";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/products/:id" element={<ProductForm />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
