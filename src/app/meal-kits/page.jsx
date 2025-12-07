"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMealKits } from "@/lib/api";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MealKitsPage() {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [mealKits, setMealKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('favorites') || '[]');
    }
    return [];
  });
  const cardsRef = useRef([]);
  const filterSectionRef = useRef(null);

  useEffect(() => {
    const fetchMealKits = async () => {
      try {
        const data = await getMealKits();
        setMealKits(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meal kits:', error);
        setLoading(false);
      }
    };
    fetchMealKits();
  }, []);

  const handleAddToCart = (e, mealKit) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(mealKit, 1);
  };

  const toggleFavorite = (e, mealKitId) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newFavorites = favorites.includes(mealKitId)
      ? favorites.filter(id => id !== mealKitId)
      : [...favorites, mealKitId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const cuisines = ["All", ...new Set(mealKits.map((kit) => kit.cuisine))];

  const filteredMealKits = mealKits.filter((kit) => {
    const matchesSearch =
      (kit.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (kit.chef?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesCuisine = selectedCuisine === "All" || kit.cuisine === selectedCuisine;

    return matchesSearch && matchesCuisine;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name':
        return a.title.localeCompare(b.title);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  useEffect(() => {
    if (!loading && filteredMealKits.length > 0) {
      // GSAP scroll animations for cards
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            {
              opacity: 0,
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: index * 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                end: "top 20%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    }

    // Filter section animation
    if (filterSectionRef.current) {
      gsap.fromTo(
        filterSectionRef.current,
        { opacity: 0, y: -30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [loading, filteredMealKits.length]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="py-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-primary">Explore Meal Kits</h1>
            <p className="text-xl text-base-content/70">
              Discover chef-crafted meal kits from around the world
            </p>
          </motion.div>

          {/* Search and Filter Section */}
          <div ref={filterSectionRef} className="bg-base-200/50 backdrop-blur-sm p-6 rounded-lg shadow-lg mb-12 border border-primary/10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Search */}
              <form onSubmit={handleSearch} className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">
                    Search by name or chef
                  </span>
                </label>
                <div className="input-group flex gap-2 items-center justify-center">
                  <input
                    type="text"
                    placeholder="Search meal kits..."
                    className="input input-bordered w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <button className="btn btn-square btn-primary">
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
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </form>

              {/* Category Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">
                    Filter by cuisine
                  </span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedCuisine}
                  onChange={(e) => setSelectedCuisine(e.target.value)}
                >
                  {cuisines.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Options */}
            <div className="mt-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-base-content">Sort by</span>
                </label>
                <select
                  className="select select-bordered w-full md:w-64"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Newest First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
              </div>
            </div>

            {/* Active Filters Display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <div className="badge badge-lg badge-primary gap-2">
                  Search: &quot;{searchTerm}&quot;
                  <button
                    onClick={() => setSearchTerm("")}
                    className="btn btn-ghost btn-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
              {selectedCuisine !== "All" && (
                <div className="badge badge-lg badge-secondary gap-2">
                  Cuisine: {selectedCuisine}
                  <button
                    onClick={() => setSelectedCuisine("All")}
                    className="btn btn-ghost btn-xs"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-base-content/70">
              Showing <span className="font-bold text-primary">{filteredMealKits.length}</span> meal kit(s)
            </p>
          </div>

          {/* Meal Kits Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filteredMealKits.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-base-content/70 mb-4">No meal kits found</p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCuisine("All");
                }}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMealKits.map((mealKit, index) => (
                <Link 
                  key={mealKit.id} 
                  href={`/meal-kits/${mealKit.id}`} 
                  className="group cursor-pointer"
                  ref={(el) => (cardsRef.current[index] = el)}
                >
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="relative overflow-hidden bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-500 border border-primary/10"
                  >
                    <div className="relative h-64">
                      <Image
                        src={mealKit.image}
                        alt={mealKit.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Favorite Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => toggleFavorite(e, mealKit.id)}
                        className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10"
                        aria-label="Add to favorites"
                      >
                        <Heart
                          className={`w-5 h-5 transition-colors ${
                            favorites.includes(mealKit.id)
                              ? 'fill-secondary text-secondary'
                              : 'text-gray-600'
                          }`}
                        />
                      </motion.button>
                    </div>
                    <div className="pt-4 space-y-2 p-4">
                      <h3 className="font-medium text-base-content group-hover:text-primary transition-colors">
                        {mealKit.title}
                      </h3>
                      <p className="text-sm text-base-content/60">{mealKit.chef}</p>
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-xs text-base-content/50 uppercase tracking-wide">{mealKit.cuisine}</p>
                        <p className="text-lg font-bold text-primary">${mealKit.price}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleAddToCart(e, mealKit)}
                        className="btn btn-primary btn-sm w-full mt-2 gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Add to Cart
                      </motion.button>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
