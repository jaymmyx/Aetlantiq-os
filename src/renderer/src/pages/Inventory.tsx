import React from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { ProductForm } from '../components/products/ProductForm';
import { ProductTable } from '../components/products/ProductTable';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/common/Button';
import { Download } from 'lucide-react';

export const Inventory: React.FC = () => {
  // 1. Pull everything we need from our custom hook
  const {
    products,
    isLoading,
    searchTerm,
    setSearchTerm,
    page,
    setPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    addProduct
  } = useProducts();

  // 2. Define dynamic actions for the Topbar (Optional, but looks great)
  const headerActions = (
    <Button variant="secondary" size="sm" className="gap-2">
      <Download className="h-4 w-4" />
      Export CSV
    </Button>
  );

  return (
    // 3. Wrap the page in our MainLayout, passing the title and actions
    <MainLayout title="Inventory Management" actions={headerActions}>
      
      <div className="flex flex-col gap-8 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Top Section: The Input Form */}
        <section>
          <ProductForm 
            onAddProduct={addProduct} 
            isLoading={isLoading} 
          />
        </section>

        {/* Bottom Section: The Data Grid */}
        <section>
          <ProductTable
            products={products}
            isLoading={isLoading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            currentPage={page}
            totalPages={totalPages}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onNextPage={() => setPage(page + 1)}
            onPrevPage={() => setPage(page - 1)}
          />
        </section>

      </div>
      
    </MainLayout>
  );
};