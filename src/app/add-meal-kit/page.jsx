"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";
import { Plus, Loader2 } from "lucide-react";
import { createMealKit } from "@/lib/api";

export default function AddMealKitPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    prepTime: "",
    servings: "",
    difficulty: "Easy",
    cuisine: "",
    dietaryTags: [],
    chef: "",
    image: "",
    ingredients: "",
  });

  const difficultyLevels = ["Easy", "Medium", "Hard"];
  const cuisineOptions = [
    "Italian",
    "Thai",
    "Mexican",
    "Mediterranean",
    "Japanese",
    "Korean",
    "French",
    "Indian",
    "Chinese",
    "American",
  ];
  const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-Free", "Dairy-Free", "Keto", "Paleo"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDietaryTagsChange = (tag) => {
    setFormData((prev) => ({
      ...prev,
      dietaryTags: prev.dietaryTags.includes(tag)
        ? prev.dietaryTags.filter((t) => t !== tag)
        : [...prev.dietaryTags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.shortDescription || !formData.price) {
        toast.error("Please fill in all required fields");
        setIsSubmitting(false);
        return;
      }

      // Convert ingredients string to array
      const ingredientsArray = formData.ingredients
        .split(",")
        .map((ing) => ing.trim())
        .filter((ing) => ing);

      const mealKitData = {
        ...formData,
        price: parseFloat(formData.price),
        servings: parseInt(formData.servings) || 2,
        ingredients: ingredientsArray,
        createdAt: new Date().toISOString(),
        chef: formData.chef || session?.user?.name || "Anonymous Chef",
        userEmail: session?.user?.email || "anonymous@chefkit.com",
      };

      // Send to Express backend
      await createMealKit(mealKitData);

      toast.success("Meal kit added successfully!");
      
      // Reset form
      setFormData({
        title: "",
        shortDescription: "",
        fullDescription: "",
        price: "",
        prepTime: "",
        servings: "",
        difficulty: "Easy",
        cuisine: "",
        dietaryTags: [],
        chef: "",
        image: "",
        ingredients: "",
      });

      // Redirect to manage page
      setTimeout(() => {
        router.push("/manage-meal-kits");
      }, 1500);
    } catch (error) {
      toast.error("Failed to add meal kit. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Add New <span className="bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Meal Kit</span>
            </h1>
            <p className="text-lg text-gray-600">
              Share your culinary creations with the ChefKit community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                Meal Kit Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="e.g., Italian Pasta Carbonara"
              />
            </div>

            {/* Short Description */}
            <div>
              <label htmlFor="shortDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                required
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Brief 1-2 line description"
                maxLength="150"
              />
              <p className="mt-1 text-xs text-gray-500">{formData.shortDescription.length}/150 characters</p>
            </div>

            {/* Full Description */}
            <div>
              <label htmlFor="fullDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Description
              </label>
              <textarea
                id="fullDescription"
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Detailed description of the meal kit..."
              ></textarea>
            </div>

            {/* Price, Prep Time, Servings */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="29.99"
                />
              </div>

              <div>
                <label htmlFor="prepTime" className="block text-sm font-semibold text-gray-700 mb-2">
                  Prep Time
                </label>
                <input
                  type="text"
                  id="prepTime"
                  name="prepTime"
                  value={formData.prepTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="30 minutes"
                />
              </div>

              <div>
                <label htmlFor="servings" className="block text-sm font-semibold text-gray-700 mb-2">
                  Servings
                </label>
                <input
                  type="number"
                  id="servings"
                  name="servings"
                  min="1"
                  value={formData.servings}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="2"
                />
              </div>
            </div>

            {/* Difficulty and Cuisine */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="difficulty" className="block text-sm font-semibold text-gray-700 mb-2">
                  Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  {difficultyLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="cuisine" className="block text-sm font-semibold text-gray-700 mb-2">
                  Cuisine Type
                </label>
                <select
                  id="cuisine"
                  name="cuisine"
                  value={formData.cuisine}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                >
                  <option value="">Select cuisine</option>
                  {cuisineOptions.map((cuisine) => (
                    <option key={cuisine} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dietary Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Dietary Tags (Optional)
              </label>
              <div className="flex flex-wrap gap-3">
                {dietaryOptions.map((tag) => (
                  <label
                    key={tag}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 cursor-pointer transition-all ${
                      formData.dietaryTags.includes(tag)
                        ? "bg-orange-100 border-orange-500 text-orange-700"
                        : "bg-white border-gray-300 text-gray-700 hover:border-orange-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.dietaryTags.includes(tag)}
                      onChange={() => handleDietaryTagsChange(tag)}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{tag}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Chef Name */}
            <div>
              <label htmlFor="chef" className="block text-sm font-semibold text-gray-700 mb-2">
                Chef Name
              </label>
              <input
                type="text"
                id="chef"
                name="chef"
                value={formData.chef}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder={session?.user?.name || "Your name"}
              />
            </div>

            {/* Image URL */}
            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="https://example.com/image.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">Provide a direct URL to your meal image</p>
            </div>

            {/* Ingredients */}
            <div>
              <label htmlFor="ingredients" className="block text-sm font-semibold text-gray-700 mb-2">
                Ingredients (comma-separated)
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Pasta, Tomatoes, Basil, Olive Oil, Garlic"
              ></textarea>
              <p className="mt-1 text-xs text-gray-500">Separate each ingredient with a comma</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-semibold text-lg shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Add Meal Kit
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => router.push("/manage-meal-kits")}
                className="px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}
