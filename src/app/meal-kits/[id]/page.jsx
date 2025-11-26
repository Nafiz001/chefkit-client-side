"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMealKitById } from "@/lib/api";
import { ArrowLeft, Clock, Users, TrendingUp, ChefHat, DollarSign, Calendar } from "lucide-react";

export default function MealKitDetailsPage({ params }) {
  const [mealKit, setMealKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchMealKit = async () => {
      try {
        const resolvedParams = await params;
        const data = await getMealKitById(resolvedParams.id);
        if (!data || !data.id) {
          router.push('/meal-kits');
        } else {
          setMealKit(data);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meal kit:', error);
        router.push('/meal-kits');
      }
    };
    fetchMealKit();
  }, [params, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <div className="flex justify-center items-center py-20">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!mealKit) {
    return null;
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "hard":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link
            href="/meal-kits"
            className="inline-flex items-center text-gray-600 hover:text-orange-600 font-medium mb-8 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Meal Kits
          </Link>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div>
              <div className="relative h-96 lg:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={mealKit.image}
                  alt={mealKit.title}
                  fill
                  className="object-cover"
                  priority
                />
                {mealKit.dietaryTags && mealKit.dietaryTags.length > 0 && (
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {mealKit.dietaryTags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${getDifficultyColor(
                      mealKit.difficulty
                    )}`}
                  >
                    {mealKit.difficulty}
                  </span>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {mealKit.title}
                </h1>
                <div className="flex items-center gap-2 text-orange-600 mb-4">
                  <ChefHat className="w-5 h-5" />
                  <span className="font-semibold">{mealKit.chef}</span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mb-6">${mealKit.price}</p>
              </div>

              {/* Meta Information Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm font-medium">Prep Time</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{mealKit.prepTime}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">Servings</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{mealKit.servings}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <TrendingUp className="w-5 h-5" />
                    <span className="text-sm font-medium">Cuisine</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{mealKit.cuisine}</p>
                </div>

                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600 mb-1">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">Added</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">
                    {new Date(mealKit.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Kit</h2>
                <p className="text-gray-700 leading-relaxed">{mealKit.fullDescription}</p>
              </div>

              {/* Ingredients */}
              <div className="bg-white p-6 rounded-xl border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients Included</h2>
                <div className="grid grid-cols-2 gap-3">
                  {mealKit.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">{ingredient}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-linear-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold text-lg shadow-lg hover:shadow-xl">
                  Add to Cart
                </button>
                <button className="flex-1 bg-white text-gray-800 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg border-2 border-gray-200">
                  Save for Later
                </button>
              </div>

              {/* Additional Info */}
              <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl">
                <p className="text-sm text-gray-700">
                  <strong className="text-orange-700">Free Shipping</strong> on orders over $50 •
                  Fresh ingredients sourced daily • Recipe card included
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
