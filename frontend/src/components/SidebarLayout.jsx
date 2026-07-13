import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const SidebarLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'View Inventory', path: '/inventory', icon: '📦' },
    { name: 'Restock Items', path: '/inventory/restock', icon: '🔄' },
    { name: 'Add Product', path: '/inventory/add-new', icon: '➕' },
    { name: 'POS', path: '/sales', icon: '🛒' },
    { name: 'Analytics & Reports', path: '/analytics', icon: '📈' },
  ];

  const username = localStorage.getItem('username') || 'User';

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-800 overflow-hidden w-full">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 lg:hidden w-full fixed top-0 left-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Yinventory Logo" className="h-8 w-auto object-contain" />
          <span className="font-bold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Yinventory</span>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 focus:outline-none transition-colors border border-slate-200"
        >
          {isOpen ? (
            <span className="text-lg font-bold block leading-none">✕</span>
          ) : (
            <span className="text-lg block leading-none">☰</span>
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 flex flex-col w-64 bg-white border-r border-slate-200 transition-transform duration-300 transform 
        lg:translate-x-0 lg:static lg:inset-auto lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header / Brand */}
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100">
          <img src="/logo.png" alt="Yinventory Logo" className="h-10 w-auto object-contain" />
          <div>
            {/* <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Yinventory</h1> */}
            <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">Inventory Management</p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 border-l-4
                  ${isActive 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border-indigo-600' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-transparent'}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-2 py-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-md">
              {username[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-900 truncate">{username}</p>
              <p className="text-[10px] font-semibold text-slate-500 tracking-wide uppercase">Staff Member</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-red-600 hover:text-red-700 bg-white hover:bg-red-50/40 border border-slate-200 hover:border-red-200 rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden w-full">
        {/* Main Content Panel */}
        <main className="flex-1 overflow-y-auto p-6 mt-16 lg:mt-0 bg-slate-50">
          <Outlet />
        </main>
      </div>

      {/* Backdrop for Mobile Menu */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
        />
      )}
    </div>
  );
};

export default SidebarLayout;
