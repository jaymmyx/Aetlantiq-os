import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initDB, addProduct, getProducts, updateProduct, deleteProduct } from './database';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Initialize the database
  initDB();
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // IPC Listener: Add Product
  ipcMain.handle('add-product', (_, product) => {
    try {
      const result = addProduct(product.sku, product.name, product.description);
      return { success: true, id: result.lastInsertRowid };
    } catch (error: any) {
      // This will gracefully handle duplicate SKUs
      return { success: false, error: error.message };
    }
  });

  // IPC Listener: Get Products (with Pagination & Search)
  ipcMain.handle('get-products', (_, params) => {
    const { limit, offset, search } = params;
    try {
      const data = getProducts(limit, offset, search);
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

  // IPC Listener: Update Product
ipcMain.handle('update-product', (_, product) => {
  try {
    const result = updateProduct(product.id, product.sku, product.name, product.description);
    return { success: result.changes > 0 };
  } catch (error: any) {
    return { success: false, error: error.message }; // Will catch duplicate SKUs on edit
  }
});

// IPC Listener: Delete Product
ipcMain.handle('delete-product', (_, id) => {
  try {
    const result = deleteProduct(id);
    return { success: result.changes > 0 };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

// Inside src/main/index.ts
ipcMain.handle('export-pdf', async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return { success: false };

  try {
    // Let the user choose where to save the invoice
    const { filePath } = await dialog.showSaveDialog(win, {
      title: 'Save Invoice',
      defaultPath: 'Invoice.pdf',
      filters: [{ name: 'PDFs', extensions: ['pdf'] }]
    });

    if (!filePath) return { success: false, canceled: true };

    // Print the window to PDF using A4 specs
    const pdfBuffer = await win.webContents.printToPDF({
      printBackground: true,
      pageSize: 'A4',
      margins: { marginType: 'none' } // We handle margins via Tailwind padding (20mm)
    });

    // Write the file to the OS
    const fs = require('fs');
    fs.writeFileSync(filePath, pdfBuffer);
    
    return { success: true, filePath };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
});

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
