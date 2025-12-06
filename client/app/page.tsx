'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));

    updateCartCount();
  }, [router]);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
    setCartCount(count);
  };

  const addToCart = (product: Product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.productId === product._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ productId: product._id, name: product.name, price: product.price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('cart');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Papaya Salad</h1>
          <div className="flex items-center gap-6">
            <Link href="/orders" className="hover:text-zinc-300">
              Orders
            </Link>
            <Link href="/cart" className="relative hover:text-zinc-300">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-4 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={handleLogout} className="text-zinc-500 hover:text-white">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Products */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-lg font-medium mb-6">Menu</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div
              key={product._id}
              className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 hover:border-zinc-700 transition"
            >
              {/* Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={product.image || 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{product.name}</h3>
                  <span className="font-bold text-lg">${product.price}</span>
                </div>
                <p className="text-zinc-500 text-sm mb-4">{product.description}</p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full py-2 bg-white text-black rounded-lg font-medium hover:bg-zinc-200 transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <p className="text-zinc-500 text-center py-8">No products available</p>
        )}
      </main>
    </div>
  );
}
