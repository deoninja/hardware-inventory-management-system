import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, AlertCircle, Package } from 'lucide-react';
import api from '../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStockItems: 0,
        totalValue: 0,
        recentMovements: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Mock data for charts (since backend aggregation for history isn't fully built yet)
    const mockChartData = [
        { name: 'Mon', stock: 4000 },
        { name: 'Tue', stock: 3000 },
        { name: 'Wed', stock: 2000 },
        { name: 'Thu', stock: 2780 },
        { name: 'Fri', stock: 1890 },
        { name: 'Sat', stock: 2390 },
        { name: 'Sun', stock: 3490 },
    ];

    const COLORS = ['#6366f1', '#10b981', '#ef4444', '#f59e0b'];
    const mockPieData = [
        { name: 'Processors', value: 400 },
        { name: 'GPUs', value: 300 },
        { name: 'RAM', value: 300 },
        { name: 'Storage', value: 200 },
    ];

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#1e1e2d] p-6 rounded-xl border border-gray-800 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Inventory Value</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                ${stats.totalValue.toLocaleString()}
                            </h3>
                        </div>
                        <div className="bg-indigo-500/10 p-3 rounded-lg text-indigo-400">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-indigo-400 mt-4 flex items-center gap-1">
                        +12% from last month
                    </p>
                </div>

                <div className="bg-[#1e1e2d] p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Low Stock Items</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {stats.lowStockItems}
                            </h3>
                        </div>
                        <div className="bg-red-500/10 p-3 rounded-lg text-red-400">
                            <AlertCircle size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-red-400 mt-4">
                        Requires attention
                    </p>
                </div>

                <div className="bg-[#1e1e2d] p-6 rounded-xl border border-gray-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-400 text-sm">Total Items</p>
                            <h3 className="text-3xl font-bold text-white mt-1">
                                {stats.totalItems}
                            </h3>
                        </div>
                        <div className="bg-emerald-500/10 p-3 rounded-lg text-emerald-400">
                            <Package size={24} />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-400 mt-4">
                        Across active categories
                    </p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Area Chart */}
                <div className="bg-[#1e1e2d] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-6">Stock Trends</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockChartData}>
                                <defs>
                                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3b" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis stroke="#6b7280" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="stock" stroke="#6366f1" fillOpacity={1} fill="url(#colorStock)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-[#1e1e2d] p-6 rounded-xl border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-6">Category Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={mockPieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {mockPieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 mt-4">
                        {mockPieData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                                <span className="text-gray-400 text-sm">{entry.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
