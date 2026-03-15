import React, { useState } from 'react';
import { MainLayout } from '../components/layout/MainLayout';
import { InvoiceTemplate } from '../components/invoices/InvoiceTemplate';
import { useInvoiceMath } from '../hooks/useInvoiceMath';
import { useProducts } from '../hooks/useProducts';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { FileDown, Plus, Trash2 } from 'lucide-react';

export const Invoices: React.FC = () => {
  // Pull our custom hooks
  const { products, isLoading: productsLoading } = useProducts();
  const { 
    items, chunkedItems, grandTotal, subtotalExclusive, totalVat, 
    addItem, removeItem 
  } = useInvoiceMath();

  // Invoice Metadata State
  const [clientName, setClientName] = useState('Walk-in Customer');
  const [invoiceNumber, setInvoiceNumber] = useState(`INV-${Math.floor(Date.now() / 1000)}`);
  const [date, setDate] = useState(new Date().toLocaleDateString('en-GB')); // e.g., 15/03/2026

  // Form Input State
  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !quantity || !unitPrice) return;

    // Find the product to get its SKU and Name
    const product = products.find(p => p.id.toString() === selectedProductId);
    if (!product) return;

    addItem({
      id: crypto.randomUUID(),
      sku: product.sku,
      name: product.name,
      quantity: Number(quantity),
      unitPriceInclusive: Number(unitPrice)
    });

    // Reset inputs after adding
    setSelectedProductId('');
    setQuantity('');
    setUnitPrice('');
  };

  const handleExportPDF = async () => {
    try {
      // Ensure you added exportPdf to preload/index.ts and main/index.ts!
      const response = await window.api.exportPdf();
      if (response.success) {
        alert(`Invoice successfully saved to: ${response.filePath}`);
      }
    } catch (error) {
      console.error('Failed to export PDF:', error);
      alert('Failed to generate PDF. Check the console for details.');
    }
  };

  // The Topbar action button
  const actions = (
    <Button variant="primary" onClick={handleExportPDF} className="gap-2 no-print">
      <FileDown className="h-4 w-4" />
      Export to PDF
    </Button>
  );

  return (
    <MainLayout title="Create Invoice" actions={actions}>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[calc(100vh-8rem)]">
        
        {/* --- LEFT COLUMN: CONTROL PANEL (Dark Mode) --- */}
        <div className="xl:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2 no-print">
          
          {/* Metadata Card */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6">
            <h3 className="text-sm font-medium text-zinc-100 mb-4 border-b border-zinc-800/60 pb-2">Invoice Details</h3>
            <div className="space-y-4">
              <Input label="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Invoice #" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
                <Input label="Date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Add Item Form Card */}
          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6">
            <h3 className="text-sm font-medium text-zinc-100 mb-4 border-b border-zinc-800/60 pb-2">Add Line Item</h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-medium text-zinc-400">Select Product</label>
                <select 
                  className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  disabled={productsLoading}
                  required
                >
                  <option value="" disabled>-- Choose from Inventory --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input 
                  label="Quantity" type="number" min="1" required
                  value={quantity} onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))} 
                />
                <Input 
                  label="Unit Price (VAT Inc)" type="number" step="0.01" min="0" required
                  value={unitPrice} onChange={(e) => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                />
              </div>

              <Button type="submit" variant="secondary" className="w-full gap-2 mt-2">
                <Plus className="h-4 w-4" /> Add to Invoice
              </Button>
            </form>
          </div>

          {/* Quick Item Management (For removing mistakes before printing) */}
          {items.length > 0 && (
            <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4">
              <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Added Items</h3>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {items.map(item => (
                  <li key={item.id} className="flex justify-between items-center text-sm bg-zinc-800/30 p-2 rounded-md">
                    <span className="truncate pr-4 text-zinc-300">{item.quantity}x {item.name}</span>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: LIVE A4 PREVIEW (Light Mode) --- */}
        <div className="xl:col-span-8 bg-zinc-950/50 border border-zinc-800/60 rounded-xl overflow-y-auto relative flex justify-center print:border-none print:overflow-visible print:block">
          
          {/* A container to scale the preview down slightly if the screen is small, while keeping actual A4 dimensions for the printer */}
          <div className="scale-90 xl:scale-100 origin-top mt-8 pb-8 print:scale-100 print:mt-0 print:pb-0">
            <InvoiceTemplate
              clientName={clientName}
              invoiceNumber={invoiceNumber}
              date={date}
              chunkedItems={chunkedItems}
              subtotal={subtotalExclusive}
              vat={totalVat}
              grandTotal={grandTotal}
            />
          </div>

        </div>

      </div>
    </MainLayout>
  );
};