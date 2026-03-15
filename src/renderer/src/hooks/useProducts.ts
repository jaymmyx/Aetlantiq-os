import { useState, useEffect, useCallback } from 'react';

// Define our TypeScript interfaces for strict typing
export interface Product {
    id: number;
    sku: string;
    name: string;
    description: string;
}

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination & Filtering State
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // 10 items per page keeps the UI clean
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch products wrapped in useCallback so it can be safely used in useEffect
    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const offset = (page - 1) * limit;
            const response = await window.api.getProducts({ limit, offset, search: searchTerm });

            if (response.success && response.data) {
                setProducts(response.data.products);
                setTotal(response.data.total);
            } else {
                setError(response.error || 'Failed to fetch products');
            }
        } catch (err) {
            setError('An unexpected error occurred while communicating with the database.');
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, searchTerm]);

    // Re-fetch whenever page or search term changes
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Reset to page 1 whenever the user types a new search term
    useEffect(() => {
        setPage(1);
    }, [searchTerm]);

    // Function to handle adding a new product
    const addProduct = async (sku: string, name: string, description: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await window.api.addProduct({ sku, name, description });

            if (response.success) {
                // Refetch to update the table immediately
                await fetchProducts();
                return true;
            } else {
                setError(response.error || 'Failed to add product. SKU might already exist.');
                return false;
            }
        } catch (err) {
            setError('An error occurred while saving the product.');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Helper properties for pagination UI
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return {
        products,
        total,
        isLoading,
        error,
        page,
        searchTerm,
        totalPages,
        hasNextPage,
        hasPrevPage,
        setPage,
        setSearchTerm,
        addProduct,
        refresh: fetchProducts
    };
}