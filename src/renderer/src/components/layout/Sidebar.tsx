import React from 'react';
import { Package, LayoutDashboard, FileText, Settings, Wallet } from 'lucide-react';

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-full bg-zinc-900/40 border-r border-zinc-800/60 flex flex-col shrink-0">
      {/* App Branding Area */}
      <div className="h-16 flex items-center px-6 border-b border-zinc-800/60 shrink-0">
        <div className="flex items-center gap-3 text-zinc-100">
          <Wallet className="h-6 w-6 text-blue-500" />
          <span className="font-semibold tracking-wide text-sm">AETLANTIQ OS</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="mb-4 px-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
          Main Menu
        </div>
        
        <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" />
        <NavItem icon={<Package size={18} />} label="Inventory" isActive />
        <NavItem icon={<FileText size={18} />} label="Invoices" />
      </nav>

      {/* Bottom Settings Area */}
      <div className="p-4 border-t border-zinc-800/60 shrink-0">
        <NavItem icon={<Settings size={18} />} label="Settings" />
      </div>
    </aside>
  );
};

// Internal helper for nav links
interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, isActive }) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500 ${
        isActive
          ? 'bg-blue-600/10 text-blue-400'
          : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
      }`}
    >
      {icon}
      {label}
    </button>
  );
};