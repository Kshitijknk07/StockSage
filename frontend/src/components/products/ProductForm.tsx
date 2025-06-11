import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Category } from "@/types";
import { productApi, categoryApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  quantity: z.number().min(0, "Quantity must be 0 or greater"),
  price: z.number().min(0, "Price must be 0 or greater"),
  categoryId: z.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      description: "",
      quantity: 0,
      price: 0,
    },
  });

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    }
  };

  const loadProduct = async () => {
    try {
      const response = await productApi.getById(Number(id));
      const product = response.data.data;
      form.reset({
        name: product.name,
        sku: product.sku,
        description: product.description,
        quantity: product.quantity,
        price: product.price,
        categoryId: product.category?.id,
      });
    } catch (error) {
      console.error("Failed to load product:", error);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true);
    try {
      const selectedCategory = data.categoryId
        ? categories.find((cat) => cat.id === data.categoryId)
        : undefined;

      if (data.categoryId && !selectedCategory) {
        throw new Error("Selected category not found");
      }

      const productData = {
        name: data.name,
        sku: data.sku,
        description: data.description || "",
        quantity: data.quantity,
        price: data.price,
        category: selectedCategory || {
          id: 0,
          name: "",
          description: "",
          products: [],
        },
      };

      if (id) {
        await productApi.update(Number(id), productData);
      } else {
        await productApi.create(productData);
      }
      navigate("/products");
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto bg-gray-800/70 backdrop-blur-md rounded-lg shadow-xl p-6 border border-gray-700">
        <div className="pb-6 mb-6 border-b border-gray-700">
          <h1 className="text-3xl font-bold text-gray-100">
            {id ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="mt-2 text-md text-gray-300">
            {id
              ? "Update the details for this product below."
              : "Fill in the details to add a new product to your inventory."}
          </p>
        </div>

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Product Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Laptop Pro X"
                          className="mt-1 p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        SKU (Stock Keeping Unit)
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., LPX-789"
                          className="mt-1 p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Description (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="A brief description of the product"
                        className="mt-1 p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Quantity
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 50"
                          className="mt-1 p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-300">
                        Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                          placeholder="e.g., 1200.00"
                          className="mt-1 p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-300">
                      Category
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      defaultValue={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="mt-1 p-3 border border-gray-600 rounded-md bg-gray-900 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-gray-800 text-gray-100 border border-gray-700">
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                            className="hover:bg-gray-700"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/products")}
                  className="px-6 py-2 rounded-lg text-gray-300 border border-gray-600 hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 transform hover:-translate-y-1"
                >
                  {isLoading
                    ? "Saving..."
                    : id
                    ? "Save Changes"
                    : "Add Product"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
