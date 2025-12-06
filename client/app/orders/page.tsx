'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface OrderItem {
    productId: {
        _id: string;
        name: string;
        price: number;
    };
    quantity: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    total: number;
    status: string;
    createdAt: string;
}

const STATUS_OPTIONS = ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'];

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
            return;
        }

        fetchOrders(userId);
    }, [router]);

    const fetchOrders = async (userId: string) => {
        try {
            const res = await api.get(`/orders/user/${userId}`);
            setOrders(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const updateStatus = async (orderId: string, newStatus: string) => {
        try {
            await api.patch(`/orders/status/${orderId}`, { status: newStatus });
            setOrders(orders.map(order =>
                order._id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            console.error(err);
            alert('Failed to update status');
        }
    };

    const deleteOrder = async (orderId: string) => {
        if (!confirm('Are you sure you want to delete this order?')) return;

        try {
            await api.delete(`/orders/delete/${orderId}`);
            setOrders(orders.filter(order => order._id !== orderId));
        } catch (err) {
            console.error(err);
            alert('Failed to delete order');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-900 text-yellow-300';
            case 'confirmed': return 'bg-blue-900 text-blue-300';
            case 'preparing': return 'bg-purple-900 text-purple-300';
            case 'ready': return 'bg-green-900 text-green-300';
            case 'completed': return 'bg-zinc-700 text-zinc-300';
            case 'cancelled': return 'bg-red-900 text-red-300';
            default: return 'bg-zinc-700 text-zinc-300';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-semibold hover:text-zinc-300">Papaya Salad</Link>
                    <span className="text-zinc-500">My Orders</span>
                </div>
            </header>

            {/* Orders */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                <h2 className="text-lg font-medium mb-6">Order History</h2>

                {loading ? (
                    <p className="text-zinc-500 text-center py-8">Loading...</p>
                ) : orders.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-zinc-500 mb-4">No orders yet</p>
                        <Link href="/" className="text-white underline hover:text-zinc-300">Start shopping</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="bg-zinc-900 rounded-xl border border-zinc-800 p-6"
                            >
                                {/* Order Header */}
                                <div className="flex justify-between items-start mb-4 pb-4 border-b border-zinc-800">
                                    <div>
                                        <p className="text-sm text-zinc-500">Order ID</p>
                                        <p className="font-mono text-sm">{order._id.slice(-8).toUpperCase()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-zinc-500 mb-2">{formatDate(order.createdAt)}</p>
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order._id, e.target.value)}
                                            className={`px-2 py-1 text-xs rounded cursor-pointer ${getStatusColor(order.status)}`}
                                        >
                                            {STATUS_OPTIONS.map(status => (
                                                <option key={status} value={status} className="bg-zinc-800 text-white">
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2 mb-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm">
                                            <span>
                                                {item.productId?.name || 'Unknown Item'}
                                                <span className="text-zinc-500"> x{item.quantity}</span>
                                            </span>
                                            <span>${(item.productId?.price || 0) * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
                                    <button
                                        onClick={() => deleteOrder(order._id)}
                                        className="text-red-400 text-sm hover:text-red-300"
                                    >
                                        Delete Order
                                    </button>
                                    <div className="text-right">
                                        <span className="text-zinc-500 text-sm mr-2">Total:</span>
                                        <span className="text-lg font-bold">${order.total}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-8 text-center">
                    <Link href="/" className="text-zinc-500 hover:text-white">← Back to Menu</Link>
                </div>
            </main>
        </div>
    );
}
