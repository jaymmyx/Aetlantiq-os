import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { PackagePlus, AlertCircle, CheckCircle2 } from 'lucide-react';

// We pass in the addProduct function and isLoading state from the useProducts hook
interface ProductFormProps {
  onAddProduct: (sku: string, name: string, description: string) => Promise<boolean>;
  isLoading: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct, isLoading }) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Local UI states for user feedback
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Basic frontend validation
    if (!sku.trim() || !name.trim()) {
      setError('SKU and Product Name are required.');
      return;
    }

    const isSuccess = await onAddProduct(sku, name, description);

    if (isSuccess) {
      setSuccess(true);
      // Clear the form on success
      setSku('');
      setName('');
      setDescription('');
      
      // Clear the success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError('Failed to add product. Ensure the SKU is unique.');
    }
  };

  return (
    <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6 w-full max-w-2xl">
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-800/60 pb-4">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <PackagePlus className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h2 className="text-base font-medium text-zinc-100">Add New Product</h2>
          <p className="text-sm text-zinc-500">Register a new item into the inventory database.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Top Row: SKU and Name side-by-side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Product SKU"
            placeholder="e.g., LAP-T480-001"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            disabled={isLoading}
            required
          />
          <Input
            label="Product Name"
            placeholder="e.g., Lenovo ThinkPad T480s"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {/* Bottom Row: Description (Textarea styled to match the Input component) */}
        <div className="flex flex-col gap-1.5 w-full">
          <label htmlFor="description" className="text-sm font-medium text-zinc-400">
            Description <span className="text-zinc-600 font-normal">(Optional)</span>
          </label>
          <textarea
            id="description"
            rows={3}
            className="flex w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none disabled:opacity-50"
            placeholder="Enter product details or specifications..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {/* Status Messages */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 p-3 rounded-md border border-emerald-500/20">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <p>Product successfully added to inventory!</p>
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Saving Product...' : 'Save Product'}
          </Button>
        </div>
        
      </form>
    </div>
  );
};