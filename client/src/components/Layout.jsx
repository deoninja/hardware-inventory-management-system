import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ArrowLeftRight, Settings, Box } from 'lucide-react';
import { motion } from 'framer-motion';

const SidebarItem = ({ icon: Icon, label, path, isActive }) => {
    return (
        <Link to={path}>
            <motion.div
                whileHover={{ x: 5 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                        ? 'bg-indigo-500/10 text-indigo-400 border-r-2 border-indigo-500'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
            >
                <Icon size={20} />
                <span className="font-medium">{label}</span>
            </motion.div>
        </Link>
    );
};

const Layout = () => {
    const location = useLocation();

    return (
        <div className="flex h-screen bg-[#1a1b26] text-white overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#16161e] border-r border-gray-800 flex flex-col">
                <div className="p-6 flex items-center gap-3">
                    <div className="bg-indigo-500 p-2 rounded-lg">
                        <Box className="text-white" size={24} />
                    </div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                        HardwareInv
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    <SidebarItem
                        icon={LayoutDashboard}
                        label="Dashboard"
                        path="/"
                        isActive={location.pathname === '/'}
                    />
                    <SidebarItem
                        icon={Package}
                        label="Inventory"
                        path="/inventory"
                        isActive={location.pathname === '/inventory'}
                    />
                    <SidebarItem
                        icon={ArrowLeftRight}
                        label="Movements"
                        path="/movements"
                        isActive={location.pathname === '/movements'}
                    />
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        path="/settings"
                        isActive={location.pathname === '/settings'}
                    />
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium">Admin User</span>
                            <span className="text-xs text-gray-500">admin@example.com</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto bg-[#1a1b26]">
                <header className="h-16 border-b border-gray-800 flex items-center justify-between px-8 bg-[#16161e]/50 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-200">
                        {location.pathname === '/' ? 'Overview' : location.pathname.slice(1).charAt(0).toUpperCase() + location.pathname.slice(2)}
                    </h2>
                    <div className="flex items-center gap-4">
                        <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
