"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMealKits } from "@/lib/api";

export default function MealKitsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [mealKits, setMealKits] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const cuisines = ["All", ...new Set(mealKits.map((kit) => kit.cuisine))];

  const filteredMealKits = mealKits.filter((kit) => {
    const matchesSearch =
      (kit.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (kit.chef?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesCuisine = selectedCuisine === "All" || kit.cuisine === selectedCuisine;

    return matchesSearch && matchesCuisine;
  });

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      <div className="py-12 px-4">
        <div className="container mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 text-base-content">Explore Meal Kits</h1>
            <p className="text-xl text-base-content/70">
              Discover chef-crafted meal kits from around the world
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-base-200 p-6 rounded-lg shadow-lg mb-12">
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

            {/* Active Filters Display */}
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <div className="badge badge-lg badge-primary gap-2">
                  Search: "{searchTerm}"
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
              {filteredMealKits.map((mealKit) => (
                <Link key={mealKit.id} href={`/meal-kits/${mealKit.id}`} className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="relative h-64">
                      <Image
                        src={mealKit.image}
                        alt={mealKit.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                    </div>
                  </div>
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
