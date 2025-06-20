import { useEffect, useState } from "react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { toast } from "sonner";

interface Category {
  id: number;
  name: string;
  description?: string;
}

const API_BASE = "http://localhost:3000";

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      setNewName("");
      setNewDesc("");
      setShowCreate(false);
      toast.success("Category created");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Error creating category");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Delete this category?")) return;
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete category");
      toast.success("Category deleted");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Error deleting category");
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Categories</h2>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button variant="default">+ New Category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>Create Category</DialogTitle>
              <div className="space-y-4">
                <Input
                  placeholder="Name"
                  value={newName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewName(e.target.value)
                  }
                />
                <Input
                  placeholder="Description"
                  value={newDesc}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewDesc(e.target.value)
                  }
                />
                <Button onClick={handleCreate} disabled={!newName}>
                  Create
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell>
                    {/* For now, only delete. Edit/View can be added similarly. */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cat.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
