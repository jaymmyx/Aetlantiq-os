import { useState, useMemo } from 'react';

export interface InvoiceItem {
    id: string; // Unique ID for the line item
    sku: string;
    name: string;
    quantity: number;
    unitPriceInclusive: number; // Inputted by user
}

export function useInvoiceMath() {
    const [items, setItems] = useState<InvoiceItem[]>([]);

    // 1. Compute line totals
    const itemsWithTotals = useMemo(() => {
        return items.map(item => ({
            ...item,
            totalPrice: item.quantity * item.unitPriceInclusive
        }));
    }, [items]);

    // 2. Compute Grand Totals
    const grandTotal = useMemo(() => {
        return itemsWithTotals.reduce((sum, item) => sum + item.totalPrice, 0);
    }, [itemsWithTotals]);

    // 3. Extract 16% VAT from the inclusive total
    const subtotalExclusive = grandTotal / 1.16;
    const totalVat = grandTotal - subtotalExclusive;

    // 4. Pagination / Overflow Logic (Max 12 items per A4 page)
    const ITEMS_PER_PAGE = 12;
    const chunkedItems = useMemo(() => {
        const chunks: InvoiceItem[][] = [];
        for (let i = 0; i < itemsWithTotals.length; i += ITEMS_PER_PAGE) {
            chunks.push(itemsWithTotals.slice(i, i + ITEMS_PER_PAGE));
        }
        return chunks.length > 0 ? chunks : [[]]; // Always return at least one empty page
    }, [itemsWithTotals]);

    const addItem = (item: InvoiceItem) => setItems(prev => [...prev, item]);
    const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id));

    return {
        items: itemsWithTotals,
        chunkedItems,
        grandTotal,
        subtotalExclusive,
        totalVat,
        addItem,
        removeItem
    };
}