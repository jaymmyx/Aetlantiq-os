import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  addProduct: (product: { sku: string; name: string; description: string }) =>
    ipcRenderer.invoke('add-product', product),

  getProducts: (params: { limit: number; offset: number; search?: string }) =>
    ipcRenderer.invoke('get-products', params),

  updateProduct: (product: { id: number; sku: string; name: string; description: string }) =>
    ipcRenderer.invoke('update-product', product),

  deleteProduct: (id: number) =>
    ipcRenderer.invoke('delete-product', id),

  exportPdf: () => ipcRenderer.invoke('export-pdf')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    // Expose these methods to the window.api object in React
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
