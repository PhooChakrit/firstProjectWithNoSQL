import mongoose from 'mongoose';
import Product from './models/Product';
import User from './models/User';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = "mongodb+srv://PHOO:bGkj4ibbo2BYn4xi@ddbms.ykpaitn.mongodb.net/";

const products = [
    {
        name: 'Classic Papaya Salad',
        price: 10,
        description: 'Thai papaya salad with peanuts and dried shrimp.',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop'
    },
    {
        name: 'Salted Crab Papaya Salad',
        price: 12,
        description: 'Papaya salad with salted crab for an extra kick.',
        image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?w=400&h=300&fit=crop'
    },
    {
        name: 'Fermented Fish Papaya Salad',
        price: 15,
        description: 'Authentic Isan style with fermented fish sauce.',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop'
    },
    {
        name: 'Spicy Seafood Papaya Salad',
        price: 18,
        description: 'Premium papaya salad with fresh shrimp and squid.',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop'
    },
    {
        name: 'Vegetarian Papaya Salad',
        price: 9,
        description: 'Fresh and light with no fish sauce, perfect for vegetarians.',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop'
    },
    {
        name: 'Papaya Salad with Grilled Chicken',
        price: 16,
        description: 'Classic papaya salad served with tender grilled chicken.',
        image: '/images/papaya-salad-grilled-chicken.png'
    }
];

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        
        // Clear existing data
        await Product.deleteMany({});
        await User.deleteMany({});
        
        // Seed products
        await Product.insertMany(products);
        console.log('Products seeded');
        
        // Seed test users
        const testUsers = [
            { username: 'testuser', password: 'testpass123' },
            { username: 'demo', password: 'demo123' }
        ];
        await User.insertMany(testUsers);
        console.log('Users seeded');
        
        mongoose.disconnect();
    })
    .catch(err => {
        console.error(err);
        mongoose.disconnect();
    });

