'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface CartItem {
    productId: string;
    name: string;
    price: number;
    quantity: number;
}

export default function CartPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const router = useRouter();

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const updateQuantity = (productId: string, delta: number) => {
        const updatedCart = cart.map(item => {
            if (item.productId === productId) {
                const newQuantity = item.quantity + delta;
                return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
            }
            return item;
        }).filter(Boolean) as CartItem[];

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleCheckout = async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            router.push('/login');
            return;
        }

        try {
            const items = cart.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }));

            await api.post('/orders', { userId, items, total });
            localStorage.removeItem('cart');
            setCart([]);
            alert('Order placed successfully!');
            router.push('/');
        } catch (err) {
            alert('Checkout failed');
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="border-b border-zinc-800">
                <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="text-xl font-semibold hover:text-zinc-300">Papaya Salad</Link>
                    <span className="text-zinc-500">Cart</span>
                </div>
            </header>

            {/* Cart */}
            <main className="max-w-4xl mx-auto px-6 py-8">
                {cart.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-zinc-500 mb-4">Your cart is empty</p>
                        <Link href="/" className="text-white underline hover:text-zinc-300">Continue shopping</Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4 mb-8">
                            {cart.map((item) => (
                                <div key={item.productId} className="flex justify-between items-center py-4 border-b border-zinc-800">
                                    <div>
                                        <h3 className="font-medium">{item.name}</h3>
                                        <p className="text-zinc-500 text-sm">${item.price} each</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => updateQuantity(item.productId, -1)}
                                                className="w-8 h-8 border border-zinc-700 rounded flex items-center justify-center hover:bg-zinc-800"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.productId, 1)}
                                                className="w-8 h-8 border border-zinc-700 rounded flex items-center justify-center hover:bg-zinc-800"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="font-medium w-16 text-right">${item.price * item.quantity}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-zinc-800 pt-4">
                            <div className="flex justify-between items-center mb-6">
                                <span className="font-medium">Total</span>
                                <span className="text-xl font-semibold">${total}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-zinc-200"
                            >
                                Checkout
                            </button>

                            <Link href="/" className="block text-center text-zinc-500 mt-4 hover:text-white">
                                Continue shopping
                            </Link>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}
