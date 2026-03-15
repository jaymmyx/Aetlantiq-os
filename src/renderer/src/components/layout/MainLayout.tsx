import React from 'react';
import { Topbar } from './TopBar';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children, 
  title = 'Inventory Management',
  actions 
}) => {
  return (
    // The overarching desktop app frame
    <div className="flex h-screen w-full overflow-hidden bg-zinc-950 text-zinc-300 font-sans selection:bg-blue-500/30">
      
      {/* Fixed Left Navigation */}
      <Sidebar />
      
      {/* Right-Hand Content Column */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Dynamic Header */}
        <Topbar title={title} actions={actions} />

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto w-full">
            {children}
          </div>
        </div>
        
      </main>
    </div>
  );
};