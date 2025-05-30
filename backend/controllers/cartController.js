const Cart = require('../models/Cart');
const Pet = require('../models/Pet');

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.pet', 'name price imageUrl');

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [],
        totalAmount: 0
      });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { petId, quantity } = req.body;

    // Find the pet
    const pet = await Pet.findById(petId);
    if (!pet) {
      res.status(404);
      throw new Error('Pet not found');
    }

    if (pet.status !== 'available') {
      res.status(400);
      throw new Error('Pet is not available for purchase');
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart if doesn't exist
      cart = await Cart.create({
        user: req.user._id,
        items: [{
          pet: petId,
          quantity,
          price: pet.price
        }],
      });
    } else {
      // Check if pet already in cart
      const existingItem = cart.items.find(item => 
        item.pet.toString() === petId.toString()
      );

      if (existingItem) {
        // Update quantity if pet already in cart
        existingItem.quantity = quantity;
      } else {
        // Add new item if pet not in cart
        cart.items.push({
          pet: petId,
          quantity,
          price: pet.price
        });
      }
    }

    // Calculate total
    cart.calculateTotal();
    await cart.save();

    // Populate pet details before sending response
    cart = await cart.populate('items.pet', 'name price imageUrl');

    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    const cartItem = cart.items.find(item => 
      item._id.toString() === req.params.itemId
    );

    if (!cartItem) {
      res.status(404);
      throw new Error('Item not found in cart');
    }

    cartItem.quantity = quantity;
    cart.calculateTotal();
    await cart.save();

    const updatedCart = await cart.populate('items.pet', 'name price imageUrl');
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = cart.items.filter(item => 
      item._id.toString() !== req.params.itemId
    );

    cart.calculateTotal();
    await cart.save();

    const updatedCart = await cart.populate('items.pet', 'name price imageUrl');
    res.json(updatedCart);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
