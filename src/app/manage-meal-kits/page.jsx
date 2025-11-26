"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { Eye, Trash2, Loader2, Plus } from "lucide-react";
import Link from "next/link";
import { getMyMealKits, deleteMealKit } from "@/lib/api";

export default function ManageMealKitsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [mealKits, setMealKits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.email) {
      loadMealKits();
    }
  }, [session]);

  const loadMealKits = async () => {
    try {
      if (session?.user?.email) {
        const data = await getMyMealKits(session.user.email);
        setMealKits(data);
      }
    } catch (error) {
      toast.error("Failed to load meal kits");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this meal kit?")) {
      return;
    }

    try {
      await deleteMealKit(id);
      setMealKits(mealKits.filter((kit) => kit.id !== id));
      toast.success("Meal kit deleted successfully");
    } catch (error) {
      toast.error("Failed to delete meal kit");
      console.error(error);
    }
  };

  const handleView = (id) => {
    router.push(`/meal-kits/${id}`);
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Manage <span className="bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Meal Kits</span>
              </h1>
              <p className="text-lg text-gray-600">
                View and manage your meal kit creations
              </p>
            </div>
            <Link
              href="/add-meal-kit"
              className="flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New
            </Link>
          </div>

          {/* Meal Kits List */}
          {mealKits.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-16 text-center">
              <div className="text-6xl mb-4">🍽️</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Meal Kits Yet</h3>
              <p className="text-gray-600 mb-6">
                Start sharing your culinary creations with the community
              </p>
              <Link
                href="/add-meal-kit"
                className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold"
              >
                <Plus className="w-5 h-5" />
                Add Your First Meal Kit
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block bg-white rounded-2xl shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Meal Kit</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cuisine</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Difficulty</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Servings</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date Added</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {mealKits.map((kit) => (
                      <tr key={kit.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={kit.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"}
                                alt={kit.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">{kit.title}</p>
                              <p className="text-sm text-gray-500 truncate">{kit.shortDescription}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{kit.cuisine || "N/A"}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              kit.difficulty === "Easy"
                                ? "bg-green-100 text-green-700"
                                : kit.difficulty === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {kit.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-semibold text-orange-600">${kit.price}</td>
                        <td className="px-6 py-4 text-gray-700">{kit.servings}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(kit.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleView(kit.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(kit.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-4">
                {mealKits.map((kit) => (
                  <div key={kit.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={kit.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"}
                        alt={kit.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            kit.difficulty === "Easy"
                              ? "bg-green-100 text-green-700"
                              : kit.difficulty === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {kit.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{kit.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{kit.shortDescription}</p>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <span>{kit.cuisine || "N/A"}</span>
                        <span className="font-semibold text-orange-600">${kit.price}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(kit.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(kit.id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <p className="text-gray-600">
                  Total Meal Kits: <span className="font-bold text-gray-900">{mealKits.length}</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}
