"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { createUser } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        toast.error("Invalid email or password");
      } else {
        toast.success("Welcome back!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    setIsLoading(true);
    try {
      const result = await signIn("google", { 
        callbackUrl: "/",
        redirect: false 
      });
      
      if (result?.ok) {
        toast.success("Welcome!");
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      setError("Failed to sign in with Google");
      toast.error("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-base-100 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-base-300">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-base-content mb-2">Welcome Back</h2>
          <p className="text-base-content/70">Sign in to your ChefKit account</p>
        </div>

        {error && (
          <div className="alert alert-error mb-6 rounded-lg">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="label">
              <span className="label-text text-base-content font-medium">Email Address</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              className="input input-bordered w-full bg-base-200 text-base-content placeholder:text-base-content/40 border-2 focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text text-base-content font-medium">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                className="input input-bordered w-full bg-base-200 text-base-content placeholder:text-base-content/40 border-2 focus:border-primary pr-14"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-base-content/60 hover:text-base-content transition-colors z-10"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary w-full text-white font-medium tracking-wide transition-all duration-300"
          >
            {isLoading ? <span className="loading loading-spinner"></span> : 'Sign In'}
          </button>
        </form>

        <div className="divider text-base-content/60">OR</div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="btn btn-outline w-full border-base-300 hover:bg-base-200 transition-all duration-300 flex items-center gap-2"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        <div className="text-center mt-8">
          <p className="text-base-content/70">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-primary hover:text-secondary transition-colors"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
