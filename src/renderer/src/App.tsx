import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Inventory } from './pages/Inventory';
import { Invoices } from './pages/Invoices';
import './assets/main.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* Redirect the root path directly to inventory */}
        <Route path="/" element={<Navigate to="/inventory" replace />} />
        
        {/* Our main application pages */}
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/invoices" element={<Invoices />} />
      </Routes>
    </HashRouter>
  );
}

export default App;