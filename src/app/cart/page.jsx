"use client";

import { useCart } from "@/contexts/CartContext";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const { data: session } = useSession();

  const totalPrice = getTotalPrice();
  const tax = totalPrice * 0.1; // 10% tax
  const deliveryFee = cart.length > 0 ? 5.99 : 0;
  const grandTotal = totalPrice + tax + deliveryFee;

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-base-100">
          <div className="container mx-auto px-4 py-16">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-base-200 p-8 rounded-full mb-6"
              >
                <ShoppingCart className="w-24 h-24 text-base-content/30" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Your Cart is Empty</h2>
              <p className="text-base-content/70 mb-8 max-w-md">
                Looks like you haven&apos;t added any meal kits to your cart yet. 
                Explore our delicious options and start cooking!
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/meal-kits" className="btn btn-primary btn-lg">
                  Browse Meal Kits
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-base-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Shopping Cart</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearCart}
              className="btn btn-outline btn-error btn-sm"
            >
              Clear Cart
            </motion.button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="card bg-base-200 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                  <div className="card-body p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Image */}
                      <div className="relative w-full sm:w-32 h-32 rounded-lg overflow-hidden shrink-0">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="128px"
                          className="object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <Link
                          href={`/meal-kits/${item.id}`}
                          className="text-xl font-bold hover:text-primary transition-colors"
                        >
                          {item.title}
                        </Link>
                        <p className="text-base-content/70 text-sm mt-1">
                          {item.shortDescription}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="badge badge-primary badge-sm">
                            {item.cuisine}
                          </span>
                          <span className="badge badge-outline badge-sm">
                            {item.servings} servings
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="btn btn-circle btn-sm btn-outline"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="font-bold text-lg w-8 text-center">
                            {item.quantity}
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="btn btn-circle btn-sm btn-outline"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-base-content/70">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.1, rotate: 15 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeFromCart(item.id)}
                          className="btn btn-ghost btn-sm btn-circle text-error hover:bg-error/10"
                        >
                          <Trash2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="card bg-base-200 shadow-lg sticky top-4">
                <div className="card-body">
                  <h2 className="card-title text-2xl mb-4 text-primary">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-base-content/70">
                      <span>Subtotal ({cart.length} items)</span>
                      <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base-content/70">
                      <span>Tax (10%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-base-content/70">
                      <span>Delivery Fee</span>
                      <span>${deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-primary">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="card-actions mt-6">
                    {session ? (
                      <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary btn-block btn-lg"
                      >
                        Proceed to Checkout
                      </motion.button>
                    ) : (
                      <div className="space-y-2 w-full">
                        <p className="text-sm text-center text-base-content/70">
                          Please login to checkout
                        </p>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Link href="/login" className="btn btn-primary btn-block">
                            Login
                          </Link>
                        </motion.div>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/meal-kits"
                    className="btn btn-outline btn-block mt-2"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
