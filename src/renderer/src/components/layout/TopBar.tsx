import React from 'react';

interface TopbarProps {
  title: string;
  actions?: React.ReactNode;
}

export const Topbar: React.FC<TopbarProps> = ({ title, actions }) => {
  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm z-10 sticky top-0">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-medium text-zinc-100">{title}</h1>
      </div>
      
      {/* Dynamic Action Buttons injected from the Page component */}
      {actions && (
        <div className="flex items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
};