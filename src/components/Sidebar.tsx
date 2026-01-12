import React from 'react';
import { LayoutDashboard, User, Briefcase, Zap } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'agent', label: 'Auto Agent', icon: Zap },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'history', label: 'Applications', icon: Briefcase },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-10 transition-all duration-300">
      <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
          <Zap className="text-white w-5 h-5" />
        </div>
        <span className="hidden lg:block ml-3 font-bold text-lg text-slate-800 tracking-tight">AutoApply</span>
      </div>

      <nav className="flex-1 py-6 flex flex-col gap-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={clsx(
                "flex items-center p-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className={clsx("w-6 h-6", isActive ? "stroke-2" : "stroke-1-5")} />
              <span className={clsx("hidden lg:block ml-3 font-medium")}>{item.label}</span>
              {isActive && (
                <div className="hidden lg:block ml-auto w-1-5 h-1-5 rounded-full bg-indigo-600"></div>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
            JD
          </div>
          <div className="hidden lg:block ml-3">
            <p className="text-sm font-medium text-slate-700">John Doe</p>
            <p className="text-xs text-slate-400">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;