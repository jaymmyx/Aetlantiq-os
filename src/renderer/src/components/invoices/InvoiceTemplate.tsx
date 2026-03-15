import React from 'react';

interface InvoiceTemplateProps {
  invoiceNumber: string;
  date: string;
  clientName: string;
  chunkedItems: any[][];
  subtotal: number;
  vat: number;
  grandTotal: number;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({
  invoiceNumber,
  date,
  clientName,
  chunkedItems,
  subtotal,
  vat,
  grandTotal
}) => {
  // Format currency cleanly
  const formatKsh = (amount: number) => `Ksh ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="flex flex-col items-center gap-8 bg-zinc-950 py-8">
      {/* Map through our array chunks to create independent A4 pages */}
      {chunkedItems.map((pageItems, pageIndex) => (
        <div 
          key={pageIndex}
          id={`invoice-page-${pageIndex + 1}`}
          className="bg-white text-zinc-900 shadow-2xl relative"
          style={{ width: '210mm', minHeight: '297mm', padding: '20mm' }}
        >
          {/* --- HEADER --- */}
          <header className="flex justify-between items-start mb-12 border-b-2 border-zinc-200 pb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-zinc-900">INVOICE</h1>
              <p className="text-sm text-zinc-500 mt-1">AETLANTIQ GROUP</p>
              <div className="mt-6">
                <p className="text-sm font-semibold">Billed To:</p>
                <p className="text-sm">{clientName}</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end">
              <div className="flex gap-4 text-sm mb-4">
                <div className="text-right">
                  <p className="font-semibold">Invoice No:</p>
                  <p className="font-semibold">Date:</p>
                </div>
                <div className="text-right">
                  <p>{invoiceNumber}</p>
                  <p>{date}</p>
                </div>
              </div>
              
              {/* ETR Barcode Placeholder Zone */}
              <div className="w-48 h-20 border-2 border-dashed border-zinc-300 flex items-center justify-center bg-zinc-50">
                <p className="text-xs text-zinc-400 font-mono text-center">ETR Barcode / QR<br/>Placement Area</p>
              </div>
            </div>
          </header>

          {/* --- TABLE --- */}
          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-b-2 border-zinc-800 text-sm font-semibold">
                <th className="py-3">SKU</th>
                <th className="py-3">Product Description</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Unit Price (VAT Inc)</th>
                <th className="py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-zinc-100">
              {pageItems.map((item: any, idx: number) => (
                <tr key={idx}>
                  <td className="py-4 font-mono text-xs text-zinc-500">{item.sku}</td>
                  <td className="py-4 font-medium">{item.name}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">{formatKsh(item.unitPriceInclusive)}</td>
                  <td className="py-4 text-right font-semibold">{formatKsh(item.totalPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* --- FOOTER & TOTALS (Only show on the final page) --- */}
          {pageIndex === chunkedItems.length - 1 && (
            <div className="mt-auto pt-8 flex justify-end">
              <div className="w-72 border-t-2 border-zinc-200 pt-4">
                <div className="flex justify-between text-sm mb-2 text-zinc-600">
                  <span>Subtotal (Exclusive):</span>
                  <span>{formatKsh(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm mb-4 text-zinc-600">
                  <span>VAT (16%):</span>
                  <span>{formatKsh(vat)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-zinc-900 border-t border-zinc-200 pt-2">
                  <span>Grand Total:</span>
                  <span>{formatKsh(grandTotal)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Page Counter */}
          <div className="absolute bottom-10 left-0 w-full text-center text-xs text-zinc-400">
            Page {pageIndex + 1} of {chunkedItems.length}
          </div>
        </div>
      ))}
    </div>
  );
};