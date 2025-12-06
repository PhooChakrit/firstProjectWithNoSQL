import express from 'express';
import Order from '../models/Order';

const router = express.Router();

// Create order
router.post('/', async (req, res) => {
    try {
        const { userId, items, total } = req.body;
        const order = new Order({ userId, items, total });
        await order.save();
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Update order status
router.patch('/status/:orderId', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        );
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Delete order
router.delete('/delete/:orderId', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.orderId);
        res.json({ message: 'Order deleted' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Get user orders (keep this last since it catches /:userId)
router.get('/user/:userId', async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.params.userId }).populate('items.productId');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

export default router;
