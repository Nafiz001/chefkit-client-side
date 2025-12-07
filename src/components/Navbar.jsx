"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ChefHat, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export default function Navbar() {
  const { data: session, status } = useSession();
  const { cart } = useCart();
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const navLinks = (
    <>
      <li>
        <Link 
          href="/" 
          className="px-4 py-2 rounded-lg transition-all duration-300 text-base-content hover:text-primary hover:bg-primary/5"
        >
          Home
        </Link>
      </li>
      <li>
        <Link 
          href="/meal-kits" 
          className="px-4 py-2 rounded-lg transition-all duration-300 text-base-content hover:text-primary hover:bg-primary/5"
        >
          Meal Kits
        </Link>
      </li>
      <li>
        <Link 
          href="/#how-it-works" 
          className="px-4 py-2 rounded-lg transition-all duration-300 text-base-content hover:text-primary hover:bg-primary/5"
        >
          How It Works
        </Link>
      </li>
      <li>
        <Link 
          href="/#chefs" 
          className="px-4 py-2 rounded-lg transition-all duration-300 text-base-content hover:text-primary hover:bg-primary/5"
        >
          Our Chefs
        </Link>
      </li>
      <li>
        <Link 
          href="/#testimonials" 
          className="px-4 py-2 rounded-lg transition-all duration-300 text-base-content hover:text-primary hover:bg-primary/5"
        >
          Reviews
        </Link>
      </li>
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-lg px-1 md:px-6 py-4">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-10 p-4 shadow-lg bg-base-100 rounded-lg w-52 border border-base-300"
          >
            {navLinks}
          </ul>
        </div>
        <Link href="/" className="text-lg sm:text-2xl font-bold tracking-wide ml-2 sm:ml-4 flex items-center gap-2">
          <div className="bg-linear-to-br from-orange-500 to-red-500 p-2 rounded-lg">
            <ChefHat className="w-5 h-5 text-white" />
          </div>
          <span className="text-primary">Chef</span>
          <span className="text-orange-600 ml-1">Kit</span>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 space-x-2">{navLinks}</ul>
      </div>
      
      <div className="navbar-end flex items-center space-x-2 sm:space-x-4">
        {/* Cart Icon */}
        <Link href="/cart" className="btn btn-ghost btn-circle relative">
          <ShoppingCart className="w-6 h-6" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-primary-content text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </Link>
        
        {status === "loading" ? (
          <div className="skeleton w-24 h-10 rounded-lg"></div>
        ) : session ? (
          <div className="dropdown dropdown-end">
            <div 
              tabIndex={0} 
              role="button" 
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 bg-linear-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
                {session.user?.name?.[0]?.toUpperCase() || "U"}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-10 p-4 shadow-lg bg-base-100 rounded-lg w-52 border border-base-300"
            >
              <li className="menu-title">
                <span className="text-base-content font-semibold">
                  {session.user?.name || "User"}
                </span>
              </li>
              <li className="text-base-content/70 text-sm px-4 py-2">
                {session.user?.email}
              </li>
              <div className="divider my-1"></div>
              <li>
                <Link href="/add-meal-kit" className="hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Meal Kit
                </Link>
              </li>
              <li>
                <Link href="/manage-meal-kits" className="hover:bg-primary/10 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  Manage Meal Kits
                </Link>
              </li>
              <li>
                <button 
                  onClick={handleSignOut}
                  className="text-error hover:bg-error/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Link href="/login" className="btn btn-sm sm:btn-md px-3 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 hover:from-orange-600 hover:to-red-600 transition-all duration-300 hover:scale-105 hover:shadow-lg">
              Login
            </Link>
            <Link href="/register" className="btn btn-sm sm:btn-md px-3 sm:px-6 py-2 bg-white text-orange-600 border-2 border-orange-500 hover:bg-orange-50 hover:border-red-500 transition-all duration-300 hover:scale-105">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
