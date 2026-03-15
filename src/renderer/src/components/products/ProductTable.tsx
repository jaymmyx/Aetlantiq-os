import React from 'react';
import { SearchBar } from '../common/SearchBar';
import { Pagination } from '../common/Pagination';
import { PackageX, Pencil, Trash2 } from 'lucide-react';

// Define the shape of our data based on the SQLite schema
interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
}

// These props perfectly match what useProducts() outputs
interface ProductTableProps {
    products: Product[];
    isLoading: boolean;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    onNextPage: () => void;
    onPrevPage: () => void;
    onEdit: (product: Product) => void;
    onDelete: (id: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
    products,
    isLoading,
    searchTerm,
    onSearchChange,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onNextPage,
    onPrevPage,
    onEdit,
    onDelete
}) => {
    return (
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl flex flex-col w-full overflow-hidden">

            {/* Top Action Bar: Title & Search */}
            <div className="flex items-center justify-between p-4 border-b border-zinc-800/60 bg-zinc-900/20">
                <h2 className="text-base font-medium text-zinc-100">Inventory List</h2>
                <div className="w-72">
                    <SearchBar
                        value={searchTerm}
                        onChange={onSearchChange}
                        placeholder="Search by SKU or Name..."
                    />
                </div>
            </div>

            {/* The Data Grid */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-zinc-900/60 text-xs uppercase tracking-wider text-zinc-500 font-medium border-b border-zinc-800/60">
                            <th className="px-6 py-4 w-40">SKU</th>
                            <th className="px-6 py-4 w-64">Product Name</th>
                            <th className="px-6 py-4">Description</th>
                            <th className="px-6 py-4 w-16 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-800/60 text-sm">
                        {isLoading ? (
                            // Loading State
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-zinc-500">
                                    <div className="animate-pulse flex flex-col items-center gap-2">
                                        <div className="h-4 w-32 bg-zinc-800 rounded"></div>
                                        <p>Loading inventory data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            // Empty State (No data or no search results)
                            <tr>
                                <td colSpan={4} className="px-6 py-16 text-center text-zinc-500">
                                    <div className="flex flex-col items-center justify-center gap-3">
                                        <div className="p-3 bg-zinc-800/30 rounded-full">
                                            <PackageX className="h-6 w-6 text-zinc-600" />
                                        </div>
                                        <p className="text-zinc-400">No products found.</p>
                                        {searchTerm && (
                                            <p className="text-xs text-zinc-600">Try adjusting your search query.</p>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            // Data Rows
                            products.map((product) => (
                                <tr
                                    key={product.id}
                                    className="hover:bg-zinc-800/30 transition-colors duration-150 group"
                                >
                                    <td className="px-6 py-4 font-mono text-zinc-300">{product.sku}</td>
                                    <td className="px-6 py-4 font-medium text-zinc-100">{product.name}</td>
                                    <td className="px-6 py-4 text-zinc-400 truncate max-w-xs">
                                        {product.description || <span className="text-zinc-600 italic">No description</span>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-1.5 text-zinc-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                                                title="Edit Product"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(product.id)}
                                                className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                                                title="Delete Product"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Footer: Pagination */}
            {!isLoading && products.length > 0 && (
                <div className="px-4 py-3 bg-zinc-900/20">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        hasNextPage={hasNextPage}
                        hasPrevPage={hasPrevPage}
                        onNext={() => onNextPage()}
                        onPrev={() => onPrevPage()}
                    />
                </div>
            )}

        </div>
    );
};