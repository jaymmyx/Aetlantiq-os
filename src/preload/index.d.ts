import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      addProduct: (product: { sku: string; name: string; description: string }) => Promise<{ success: boolean; id?: number; error?: string }>;
      getProducts: (params: { limit: number; offset: number; search?: string }) => Promise<{ success: boolean; data?: { products: any[]; total: number }; error?: string }>;
    };
  }
}
