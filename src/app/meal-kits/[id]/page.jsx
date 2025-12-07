"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMealKitById, getReviews, createReview, deleteReview } from "@/lib/api";
import { ArrowLeft, Clock, Users, TrendingUp, ChefHat, Calendar, Star, Trash2, ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function MealKitDetailsPage({ params }) {
  const { addToCart } = useCart();
  const [mealKit, setMealKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { data: session } = useSession();
  const detailsRef = useRef(null);
  const reviewsRef = useRef(null);

  useEffect(() => {
    const fetchMealKit = async () => {
      try {
        const resolvedParams = await params;
        const data = await getMealKitById(resolvedParams.id);
        if (!data || !data.id) {
          router.push('/meal-kits');
        } else {
          setMealKit(data);
          fetchReviews(resolvedParams.id);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching meal kit:', error);
        router.push('/meal-kits');
      }
    };
    fetchMealKit();
  }, [params, router]);

  useEffect(() => {
    if (!loading && mealKit && detailsRef.current) {
      gsap.fromTo(
        detailsRef.current.children,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        }
      );
    }

    if (!reviewsLoading && reviewsRef.current) {
      gsap.fromTo(
        reviewsRef.current,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: reviewsRef.current,
            start: "top 80%",
          },
        }
      );
    }
  }, [loading, mealKit, reviewsLoading]);

  const fetchReviews = async (mealKitId) => {
    try {
      const data = await getReviews(mealKitId);
      setReviews(data);
      setReviewsLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviewsLoading(false);
    }
  };

  const handleAddToCart = () => {
    addToCart(mealKit, quantity);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Please login to submit a review");
      router.push("/login");
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error("Please write a review comment");
      return;
    }

    setSubmitting(true);
    try {
      const reviewData = {
        mealKitId: mealKit.id,
        rating: newReview.rating,
        comment: newReview.comment,
        userName: session.user.name,
        userEmail: session.user.email,
        userImage: session.user.image || "https://i.pravatar.cc/150?img=68",
      };

      await createReview(reviewData);
      toast.success("Review submitted successfully!");
      setNewReview({ rating: 5, comment: "" });
      fetchReviews(mealKit.id);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully!");
      fetchReviews(mealKit.id);
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error("Failed to delete review");
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

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
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
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
            </motion.div>

            {/* Details Section */}
            <div ref={detailsRef} className="space-y-6">
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
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="btn btn-circle btn-sm btn-outline"
                    >
                      -
                    </button>
                    <span className="font-bold text-xl w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="btn btn-circle btn-sm btn-outline"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddToCart}
                    className="flex-1 bg-linear-to-r from-primary to-secondary text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all font-semibold text-lg shadow-lg flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </motion.button>
                  <Link 
                    href="/cart"
                    className="flex-1 bg-white text-gray-800 px-8 py-4 rounded-lg hover:bg-gray-50 transition-colors font-semibold text-lg border-2 border-gray-200 text-center"
                  >
                    View Cart
                  </Link>
                </div>
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

          {/* Reviews Section */}
          <div ref={reviewsRef} className="mt-16">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-base-300">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-primary mb-2">Customer Reviews</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-base-content">{averageRating}</span>
                    </div>
                    <span className="text-base-content/70">({reviews.length} review{reviews.length !== 1 ? 's' : ''})</span>
                  </div>
                </div>
              </div>

              {/* Review Form */}
              {session ? (
                <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Write a Review</h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              star <= newReview.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                    <textarea
                      className="textarea textarea-bordered w-full h-24 resize-none"
                      placeholder="Share your experience with this meal kit..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn btn-primary px-6"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 text-center">
                  <p className="text-gray-600 mb-4">Please login to write a review</p>
                  <Link href="/login" className="btn btn-primary">Login</Link>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-6">
                {reviewsLoading ? (
                  <div className="text-center py-8">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="p-6 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="avatar">
                            <div className="w-12 rounded-full">
                              <Image
                                src={review.userImage}
                                alt={review.userName}
                                width={48}
                                height={48}
                              />
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.userName}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.createdAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {session?.user?.email === review.userEmail && (
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="btn btn-ghost btn-sm text-error"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
