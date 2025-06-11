import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-100">
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm shadow-lg">
        <div className="container mx-auto flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="font-bold text-2xl text-blue-400 tracking-tight"
          >
            StockSage
          </Link>
          <nav className="ml-auto flex gap-4">
            <Button variant="ghost" asChild>
              <Link
                to="/products"
                className="text-gray-300 hover:text-blue-300 font-medium transition-colors"
              >
                Products
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link
                to="/categories"
                className="text-gray-300 hover:text-blue-300 font-medium transition-colors"
              >
                Categories
              </Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 bg-gray-900/80 backdrop-blur-md rounded-lg shadow-xl p-6 border border-gray-700">
          {children}
        </div>
      </main>
    </div>
  );
}
