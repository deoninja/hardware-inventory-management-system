import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../api/axios';

const ItemModal = ({ isOpen, onClose, onItemSaved, itemToEdit = null }) => {
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        categoryName: '',
        quantity: 0,
        price: 0,
        minStockLevel: 5
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (itemToEdit) {
            setFormData({
                name: itemToEdit.name,
                sku: itemToEdit.sku,
                categoryName: itemToEdit.category?.name || '',
                supplierName: itemToEdit.supplier?.name || '',
                locationName: itemToEdit.location?.name || '',
                quantity: itemToEdit.quantity,
                price: itemToEdit.price,
                minStockLevel: itemToEdit.minStockLevel
            });
        } else {
            setFormData({
                name: '',
                sku: '',
                categoryName: '',
                supplierName: '',
                locationName: '',
                quantity: 0,
                price: 0,
                minStockLevel: 5
            });
        }
    }, [itemToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (itemToEdit) {
                await api.put(`/items/${itemToEdit.id}`, formData);
            } else {
                await api.post('/items', formData);
            }
            onItemSaved();
            onClose();
        } catch (error) {
            console.error('Error saving item:', error);
            alert('Failed to save item');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-[#1e1e2d] w-full max-w-lg rounded-xl border border-gray-700 shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">
                        {itemToEdit ? 'Edit Item' : 'Add New Item'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Item Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#16161e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Product Name"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">SKU</label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                required
                                className="w-full bg-[#16161e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="SKU-123"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm text-gray-400">Category</label>
                        <input
                            type="text"
                            name="categoryName"
                            value={formData.categoryName}
                            onChange={handleChange}
                            required
                            className="w-full bg-[#16161e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Electronics, Cables, etc."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Supplier (Optional)</label>
                            <input
                                type="text"
                                name="supplierName"
                                value={formData.supplierName}
                                onChange={handleChange}
                                className="w-full bg-[#16161e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="TechStore Inc."
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Location (Optional)</label>
                            <input
                                type="text"
                                name="locationName"
                                value={formData.locationName}
                                onChange={handleChange}
                                className="w-full bg-[#16161e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="Shelf A1"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full bg-[#16161e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Price ($)</label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                className="w-full bg-[#16161e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-sm text-gray-400">Min Stock</label>
                            <input
                                type="number"
                                name="minStockLevel"
                                value={formData.minStockLevel}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full bg-[#16161e] border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        >
                            <Save size={18} />
                            {loading ? 'Saving...' : 'Save Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ItemModal;
