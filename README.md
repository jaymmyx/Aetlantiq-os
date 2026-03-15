# Aetlantiq OS - Desktop Accounting & Inventory Manager

A modern, cross-platform desktop application designed to streamline inventory management and financial data entry. Built with a focus on high performance, secure local data storage, and a premium "dark mode" user experience.

## MVP Features

* **Offline-First Architecture:** Full local data persistence using `better-sqlite3` with zero latency.
* **Secure IPC Bridge:** Strict separation of concerns between the Node.js backend and React frontend, adhering to Electron security best practices.
* **Real-time Inventory Filtering:** Debounced, wildcard-based SQLite queries for instant SKU and product lookups.
* **Scalable UI Design System:** Custom-built React components utilizing Tailwind CSS for a cohesive, Adobe Acrobat-inspired dark mode aesthetic.
* **Optimized Data Grids:** Built-in pagination math handled via custom React hooks to keep UI components pure and performant.

## Tech Stack

* **Framework:** Electron + Vite
* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons
* **Backend:** Node.js
* **Database:** SQLite3 (`better-sqlite3`)
* **State Management:** Custom React Hooks

## Getting Started

### Prerequisites
* Node.js (v18 or higher)
* Git

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/jaymmyx/aetlantiq-os.git](https://github.com/jaymmyx/aetlantiq-os.git)
   cd aetlantiq-os