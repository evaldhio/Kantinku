const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Menu = require('../models/Menu');
const { auth, isAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  }
});

router.get('/', async (req, res) => {
  try {
    const menus = await Menu.find().sort({ createdAt: -1 });
    res.json(menus);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menus', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu', error: error.message });
  }
});

router.post('/', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;

    const menu = new Menu({
      name,
      description,
      price,
      category,
      available: available !== undefined ? available : true,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await menu.save();
    res.status(201).json({ message: 'Menu created successfully', menu });
  } catch (error) {
    res.status(500).json({ message: 'Error creating menu', error: error.message });
  }
});

router.put('/:id', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, available } = req.body;

    const updateData = {
      name,
      description,
      price,
      category,
      available
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    res.json({ message: 'Menu updated successfully', menu });
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu', error: error.message });
  }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ message: 'Menu not found' });
    }
    res.json({ message: 'Menu deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu', error: error.message });
  }
});

module.exports = router;