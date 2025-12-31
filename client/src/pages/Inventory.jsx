import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Filter } from 'lucide-react';
import api from '../api/axios';
import ItemModal from '../components/ItemModal';

const Inventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [itemToEdit, setItemToEdit] = useState(null);

    const fetchItems = async () => {
        try {
            setLoading(true);
            const response = await api.get('/items');
            setItems(response.data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/items/${id}`);
                fetchItems();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const openAddModal = () => {
        setItemToEdit(null);
        setIsModalOpen(true);
    };

    const openEditModal = (item) => {
        setItemToEdit(item);
        setIsModalOpen(true);
    };

    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Inventory</h2>
                    <p className="text-gray-400 text-sm">Manage your hardware assets</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                    <Plus size={20} />
                    Add Item
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search items, SKU, or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#1e1e2d] border border-gray-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 bg-[#1e1e2d] border border-gray-700 text-gray-300 px-4 py-2 rounded-lg hover:text-white hover:bg-gray-800 transition-colors">
                    <Filter size={20} />
                    <span>Filter</span>
                </button>
            </div>

            {/* Table */}
            <div className="bg-[#1e1e2d] rounded-xl border border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-[#16161e] border-b border-gray-800">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">SKU</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quantity</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Loading inventory...</td>
                                </tr>
                            ) : filteredItems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No items found</td>
                                </tr>
                            ) : (
                                filteredItems.map((item) => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-white">{item.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-400 font-mono">{item.sku}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                                                {item.category?.name}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`text-sm font-medium ${item.quantity <= item.minStockLevel ? 'text-red-400' : 'text-emerald-400'}`}>
                                                {item.quantity}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-300">
                                            ${item.price.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(item)}
                                                    className="text-gray-400 hover:text-indigo-400 transition-colors"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-gray-400 hover:text-red-400 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ItemModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onItemSaved={fetchItems}
                itemToEdit={itemToEdit}
            />
        </div>
    );
};

export default Inventory;
