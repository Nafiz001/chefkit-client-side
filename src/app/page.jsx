"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMealKits } from "@/lib/api";
import { chefs } from "@/data/mealKits";
import { ChefHat, Clock, Users, Star, Package, Truck, Utensils } from "lucide-react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mealKits, setMealKits] = useState([]);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80",
      title: "Cook Like a Chef",
      subtitle: "Discover chef-crafted meal kits delivered to your door",
      cta: "Shop Meal Kits",
      link: "/meal-kits"
    },
    {
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80", 
      title: "Fresh Ingredients",
      subtitle: "Premium quality ingredients, perfectly portioned",
      cta: "Explore Options",
      link: "/meal-kits"
    },
    {
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
      title: "Easy Recipes",
      subtitle: "Restaurant-quality meals made simple at home",
      cta: "View Recipes",
      link: "/meal-kits"
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

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

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar />

      {/* Hero Slider Section - Completely Redesigned */}
      <div className="relative h-[65vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                sizes="100vw"
                className="object-cover"
                priority={index === 0}
              />
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/60 to-transparent"></div>
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center z-10">
              <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
                <div className="max-w-3xl">
                  {/* Animated Badge */}
                  <div className="inline-flex items-center gap-2 bg-linear-to-r from-orange-500 to-red-500 text-white px-4 py-1.5 rounded-full mb-4 animate-pulse">
                    <ChefHat className="w-4 h-4" />
                    <span className="text-xs font-semibold tracking-wider uppercase">Premium Meal Kits</span>
                  </div>
                  
                  {/* Main Title with Gradient */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    <span className="bg-linear-to-r from-white via-orange-100 to-orange-200 bg-clip-text text-transparent">
                      {slide.title}
                    </span>
                  </h1>
                  
                  {/* Subtitle */}
                  <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-6 font-light leading-relaxed max-w-2xl">
                    {slide.subtitle}
                  </p>
                  
                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-3 relative z-20">
                    <Link 
                      href={slide.link} 
                      className="group relative overflow-hidden bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-semibold text-base transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/50 flex items-center gap-2 cursor-pointer"
                    >
                      <span>{slide.cta}</span>
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    
                    <Link 
                      href="/#how-it-works" 
                      className="bg-white/10 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold text-base border-2 border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 flex items-center gap-2 cursor-pointer"
                    >
                      <span>Learn More</span>
                      <Clock className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-64 h-64 bg-linear-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse -z-10 pointer-events-none"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-linear-to-tr from-orange-500/10 to-red-500/10 rounded-full blur-3xl animate-pulse -z-10 pointer-events-none" style={{animationDelay: "1s"}}></div>
          </div>
        ))}
        
        {/* Slide Indicators - Redesigned */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 bg-black/30 backdrop-blur-sm px-6 py-3 rounded-full z-30">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? "w-12 h-3 bg-linear-to-r from-orange-500 to-red-500" 
                  : "w-3 h-3 bg-white/40 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        
        {/* Navigation Arrows */}
        <button
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group z-30"
        >
          <svg className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 group z-30"
        >
          <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Featured Meal Kits Section */}
      <section className="py-20 bg-base-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light mb-4 text-base-content">
              Experience the joy of Cooking with{" "}
              <span className="font-medium text-primary">Premium Meal Kits</span>
            </h2>
            <div className="w-24 h-0.5 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              Discover handpicked meal kits from professional chefs worldwide
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="space-y-4">
                  <div className="skeleton h-64 w-full"></div>
                  <div className="skeleton h-4 w-3/4"></div>
                  <div className="skeleton h-4 w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mealKits.slice(0, 6).map((mealKit) => (
                <Link key={mealKit.id} href={`/meal-kits/${mealKit.id}`} className="group cursor-pointer">
                  <div className="relative overflow-hidden bg-white rounded-sm shadow-sm hover:shadow-xl transition-all duration-500">
                    <div className="relative h-64">
                      <Image
                        src={mealKit.image}
                        alt={mealKit.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={mealKit.id === 1}
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
          
          <div className="text-center mt-12">
            <Link 
              href="/meal-kits" 
              className="btn btn-outline btn-primary btn-lg px-12 rounded-none transition-all duration-300 text-sm font-medium tracking-wider uppercase"
            >
              View All Meal Kits
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-linear-to-br from-base-200/50 to-base-300/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-light mb-6 text-base-content">
                Why Choose ChefKit?
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 shrink-0"></div>
                  <div>
                    <h3 className="font-medium mb-2 text-base-content">Restaurant Quality</h3>
                    <p className="text-base-content/70 leading-relaxed">
                      Experience authentic flavors with recipes designed by professional chefs.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 shrink-0"></div>
                  <div>
                    <h3 className="font-medium mb-2 text-base-content">Fresh Ingredients</h3>
                    <p className="text-base-content/70 leading-relaxed">
                      Premium ingredients delivered fresh to your door, perfectly portioned.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-2 h-2 bg-primary rounded-full mt-3 shrink-0"></div>
                  <div>
                    <h3 className="font-medium mb-2 text-base-content">Easy to Follow</h3>
                    <p className="text-base-content/70 leading-relaxed">
                      Step-by-step instructions make cooking restaurant meals simple and fun.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80"
                alt="Cooking with meal kit"
                width={800}
                height={600}
                className="w-full rounded-sm shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-sm -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light mb-4 text-base-content">
              How It Works
            </h2>
            <div className="w-24 h-0.5 bg-primary mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Choose", icon: <Package className="w-12 h-12" />, desc: "Select your meal kit" },
              { name: "Deliver", icon: <Truck className="w-12 h-12" />, desc: "Fresh to your door" },
              { name: "Cook", icon: <ChefHat className="w-12 h-12" />, desc: "Follow easy steps" },
              { name: "Enjoy", icon: <Utensils className="w-12 h-12" />, desc: "Savor the meal" },
            ].map((step, index) => (
              <div key={step.name} className="group block">
                <div className="relative overflow-hidden bg-base-200 rounded-sm p-8 hover:shadow-lg transition-all duration-300 text-center">
                  <div className="text-primary mb-4 flex justify-center">{step.icon}</div>
                  <h3 className="text-base-content font-medium text-lg mb-2">{step.name}</h3>
                  <p className="text-sm text-base-content/60">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Chefs Section */}
      <section id="chefs" className="py-20 bg-linear-to-br from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light mb-4 text-base-content">
              Meet Our Master <span className="font-medium text-primary">Chefs</span>
            </h2>
            <div className="w-24 h-0.5 bg-primary mx-auto mb-6"></div>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              Learn from culinary experts from around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {chefs.map((chef) => (
              <div key={chef.id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <figure className="px-6 pt-6">
                  <div className="avatar">
                    <div className="w-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <Image 
                        src={chef.image} 
                        alt={chef.name}
                        width={128}
                        height={128}
                        className="object-cover"
                      />
                    </div>
                  </div>
                </figure>
                <div className="card-body items-center text-center">
                  <h3 className="card-title text-base-content group-hover:text-primary transition-colors">
                    {chef.name}
                  </h3>
                  <p className="text-sm text-primary font-medium">{chef.specialty}</p>
                  <p className="text-xs text-base-content/60 mt-2">{chef.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-light mb-4 text-base-content">
              What Our Customers <span className="font-medium text-secondary">Say</span>
            </h2>
            <div className="w-24 h-0.5 bg-secondary mx-auto mb-6"></div>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
              Join thousands of home chefs who love ChefKit
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                comment: "ChefKit has transformed my cooking! The recipes are easy to follow and the results are amazing.",
                rating: 5,
                image: "https://i.pravatar.cc/150?img=1"
              },
              {
                name: "Mike Chen",
                comment: "I love the variety of cuisines available. Every meal feels like dining at a restaurant.",
                rating: 5,
                image: "https://i.pravatar.cc/150?img=13"
              },
              {
                name: "Emily Rodriguez",
                comment: "The ingredient quality is outstanding. ChefKit makes cooking fun and stress-free!",
                rating: 5,
                image: "https://i.pravatar.cc/150?img=5"
              }
            ].map((testimonial, index) => (
              <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="card-body">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-base-content/70 mb-4 italic">&quot;{testimonial.comment}&quot;</p>
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-12 rounded-full">
                        <Image src={testimonial.image} alt={testimonial.name} width={48} height={48} />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-base-content">{testimonial.name}</p>
                      <p className="text-sm text-base-content/60">Verified Customer</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-neutral text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-light mb-6">
            Stay Updated with New Meal Kits
          </h2>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Get the latest recipes, chef tips, and exclusive meal kit collections.
          </p>
          <div className="flex justify-center items-stretch flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="input input-bordered flex-1 rounded-none bg-white text-neutral w-full sm:w-auto min-h-12"
              suppressHydrationWarning
            />
            <button 
              className="btn btn-primary rounded-none px-8 text-sm font-medium tracking-wider uppercase border-0 w-full sm:w-auto"
              suppressHydrationWarning
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
