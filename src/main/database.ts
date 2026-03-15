import Database from 'better-sqlite3';
import path from 'path';
import { app } from 'electron';

// Set up the database in the user's local app data folder
const dbPath = path.join(app.getPath('userData'), 'accounting_mvp.db');
const db = new Database(dbPath);

export function initDB() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sku TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT
    )
  `);
}

export function addProduct(sku: string, name: string, description: string) {
    const stmt = db.prepare('INSERT INTO products (sku, name, description) VALUES (?, ?, ?)');
    return stmt.run(sku, name, description);
}

export function getProducts(limit: number, offset: number, searchTerm: string = '') {
    // Query to get the paginated and filtered products
    const stmt = db.prepare(`
    SELECT * FROM products 
    WHERE name LIKE ? OR sku LIKE ?
    ORDER BY id DESC 
    LIMIT ? OFFSET ?
  `);

    const searchPattern = `%${searchTerm}%`;
    const products = stmt.all(searchPattern, searchPattern, limit, offset);

    // Query to get the total count for the pagination UI
    const countStmt = db.prepare(`
    SELECT COUNT(*) as total FROM products 
    WHERE name LIKE ? OR sku LIKE ?
  `);
    const totalResult = countStmt.get(searchPattern, searchPattern) as { total: number };

    return { products, total: totalResult.total };
}

export function updateProduct(id: number, sku: string, name: string, description: string) {
    const stmt = db.prepare('UPDATE products SET sku = ?, name = ?, description = ? WHERE id = ?');
    return stmt.run(sku, name, description, id);
}

export function deleteProduct(id: number) {
    const stmt = db.prepare('DELETE FROM products WHERE id = ?');
    return stmt.run(id);
}