import CategoryList from "./CategoryList";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Categories</h1>
        <CategoryList />
      </div>
      <Toaster />
    </div>
  );
}

export default App;
