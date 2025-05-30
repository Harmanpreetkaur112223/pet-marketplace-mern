import React, { useState, useEffect } from 'react';
import { cartService, handleApiError } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const data = await cartService.getCart();
      setCart(data);
      setError(null);
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      toast.error(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    try {
      const updatedCart = await cartService.updateCartItem(itemId, quantity);
      setCart(updatedCart);
      toast.success('Cart updated successfully');
    } catch (err) {
      const errorData = handleApiError(err);
      toast.error(errorData.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const updatedCart = await cartService.removeFromCart(itemId);
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (err) {
      const errorData = handleApiError(err);
      toast.error(errorData.message);
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      setCart({ items: [], totalAmount: 0 });
      toast.success('Cart cleared successfully');
    } catch (err) {
      const errorData = handleApiError(err);
      toast.error(errorData.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchCart}
          className="mt-4 btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-6">Start shopping to add items to your cart!</p>
          <Link to="/pets" className="btn btn-primary">
            Browse Pets
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shopping Cart</h2>
          <button
            onClick={handleClearCart}
            className="btn btn-secondary"
          >
            Clear Cart
          </button>
        </div>

        <div className="divide-y divide-gray-200">
          {cart.items.map((item) => (
            <div key={item._id} className="py-6 flex items-center">
              <img
                src={item.pet.imageUrl}
                alt={item.pet.name}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.pexels.com/photos/4587998/pexels-photo-4587998.jpeg?auto=compress&cs=tinysrgb&w=500';
                }}
              />

              <div className="ml-6 flex-1">
                <h3 className="text-lg font-semibold">{item.pet.name}</h3>
                <p className="text-gray-600">${item.price.toLocaleString()}</p>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                    className="btn btn-secondary px-2 py-1"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                    className="btn btn-secondary px-2 py-1"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 border-t pt-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-lg font-semibold">Total:</span>
            <span className="text-2xl font-bold">${cart.totalAmount.toLocaleString()}</span>
          </div>

          <div className="flex justify-end space-x-4">
            <Link to="/pets" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <button className="btn btn-primary">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
