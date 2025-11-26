const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    let orders;
    if (req.user.role === 'admin') {
      orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.menu')
        .sort({ createdAt: -1 });
    } else {
      orders = await Order.find({ user: req.user.userId })
        .populate('items.menu')
        .sort({ createdAt: -1 });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.menu');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { items, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item' });
    }

    const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = new Order({
      user: req.user.userId,
      items,
      totalPrice,
      notes: notes || ''
    });

    await order.save();
    await order.populate('items.menu');

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { status, items, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role === 'admin') {
      if (status) order.status = status;
    } else {
      if (order.user.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      if (order.status !== 'pending') {
        return res.status(400).json({ message: 'Cannot modify order after it has been processed' });
      }
      if (items) {
        order.items = items;
        order.totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
      if (notes !== undefined) order.notes = notes;
    }

    await order.save();
    await order.populate('items.menu');

    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && order.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (order.status !== 'pending' && req.user.role !== 'admin') {
      return res.status(400).json({ message: 'Cannot delete order after it has been processed' });
    }

    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting order', error: error.message });
  }
});

module.exports = router;