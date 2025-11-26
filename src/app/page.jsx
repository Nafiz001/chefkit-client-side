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
      cta: "Shop Meal Kits"
    },
    {
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=1200&q=80", 
      title: "Fresh Ingredients",
      subtitle: "Premium quality ingredients, perfectly portioned",
      cta: "Explore Options"
    },
    {
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80",
      title: "Easy Recipes",
      subtitle: "Restaurant-quality meals made simple at home",
      cta: "View Recipes"
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

      {/* Hero Slider Section */}
      <div className="relative h-[70vh] lg:h-[80vh] overflow-hidden bg-linear-to-r from-base-300 to-base-200">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <div className="grid lg:grid-cols-2 h-full">
              <div className="flex items-center justify-center p-8 lg:p-16 bg-linear-to-br from-primary/5 to-secondary/5">
                <div className="max-w-xl text-center lg:text-left">
                  <h1 className="text-4xl lg:text-6xl font-light mb-6 text-base-content leading-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg lg:text-xl text-base-content/70 mb-8 font-light leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <br />
                  <Link 
                    href="/meal-kits" 
                    className="btn btn-primary btn-lg px-8 py-3 rounded-none border-0 bg-neutral text-white hover:bg-neutral-focus transition-all duration-300 text-sm font-medium tracking-wider uppercase"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
              
              <div className="relative overflow-hidden hidden lg:block">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-linear-to-l from-transparent to-primary/10"></div>
              </div>
            </div>
          </div>
        ))}
        
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
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
              className="input input-bordered flex-1 rounded-none bg-white text-neutral w-full sm:w-auto min-h-[48px]"
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
