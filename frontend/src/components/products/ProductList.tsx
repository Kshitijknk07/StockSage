import { useEffect, useState } from "react";
import type { Product } from "@/types";
import { productApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const response = await productApi.getAll();
      setProducts(response.data.data);
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await productApi.delete(id);
        loadProducts();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="bg-gray-800/70 backdrop-blur-md rounded-lg shadow-xl p-6 border border-gray-700">
        <div className="pb-6 mb-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-100">Products</h1>
              <p className="mt-2 text-md text-gray-300">
                Manage your product inventory with ease. Add, edit, or delete
                products as needed.
              </p>
            </div>
            <Button
              onClick={() => navigate("/products/new")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:-translate-y-1"
            >
              <PlusCircle className="h-5 w-5" />
              Add New Product
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-700/50">
              <TableRow>
                <TableHead className="font-bold text-gray-200 text-sm py-3 px-4">
                  Name
                </TableHead>
                <TableHead className="font-bold text-gray-200 text-sm py-3 px-4">
                  SKU
                </TableHead>
                <TableHead className="font-bold text-gray-200 text-sm py-3 px-4">
                  Category
                </TableHead>
                <TableHead className="font-bold text-gray-200 text-sm py-3 px-4 text-right">
                  Quantity
                </TableHead>
                <TableHead className="font-bold text-gray-200 text-sm py-3 px-4 text-right">
                  Price
                </TableHead>
                <TableHead className="font-bold text-gray-200 text-sm py-3 px-4 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-400 text-lg"
                  >
                    Loading products...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-gray-400 text-lg font-medium"
                  >
                    No products found. Add your first product to get started!
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow
                    key={product.id}
                    className="border-b border-gray-700 hover:bg-gray-700/60 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-100 py-3 px-4">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-gray-400 py-3 px-4">
                      {product.sku}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-800/30 text-blue-300 border border-blue-700">
                        {product.category?.name || "Uncategorized"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right py-3 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          product.quantity > 10
                            ? "bg-green-800/30 text-green-300 border border-green-700"
                            : product.quantity > 0
                            ? "bg-yellow-800/30 text-yellow-300 border border-yellow-700"
                            : "bg-red-800/30 text-red-300 border border-red-700"
                        }`}
                      >
                        {product.quantity}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-gray-100 py-3 px-4">
                      ${product.price.toFixed(2)}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex justify-end gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/products/${product.id}`)}
                          className="flex items-center gap-1 text-blue-400 border-blue-600 hover:bg-blue-900 hover:border-blue-500 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center gap-1 bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
