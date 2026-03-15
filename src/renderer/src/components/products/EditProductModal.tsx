import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { AlertCircle } from 'lucide-react';

interface Product {
  id: number;
  sku: string;
  name: string;
  description: string;
}

interface EditProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: number, sku: string, name: string, description: string) => Promise<boolean>;
  isLoading: boolean;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  isOpen,
  onClose,
  onUpdate,
  isLoading
}) => {
  const [sku, setSku] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Pre-fill the form whenever the selected product changes
  useEffect(() => {
    if (product) {
      setSku(product.sku);
      setName(product.name);
      setDescription(product.description || '');
      setError(null);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    
    setError(null);
    if (!sku.trim() || !name.trim()) {
      setError('SKU and Product Name are required.');
      return;
    }

    const isSuccess = await onUpdate(product.id, sku, name, description);
    if (isSuccess) {
      onClose(); // Close the modal on success
    } else {
      setError('Failed to update product. Ensure the SKU is unique.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Product">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Product SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          label="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          required
        />
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium text-zinc-400">Description</label>
          <textarea
            rows={3}
            className="flex w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 focus:ring-1 focus:ring-blue-500 transition-all resize-none disabled:opacity-50"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-zinc-800/60">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? 'Updating...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};