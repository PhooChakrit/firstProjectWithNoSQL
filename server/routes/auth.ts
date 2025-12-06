import express from 'express';
import User from '../models/User';

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json({ message: 'User created' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt:', { username, password });
        
        const user = await User.findOne({ username });
        console.log('User found:', user ? `Yes (${user.username})` : 'No');
        
        if (!user || user.password !== password) {
            console.log('Login failed:', !user ? 'User not found' : 'Password mismatch');
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        console.log('Login successful for user:', user.username);
        res.json({ message: 'Login successful', userId: user._id });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: err });
    }
});

export default router;
