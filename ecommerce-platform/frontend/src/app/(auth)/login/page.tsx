"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { useAuthStore } from "@/store";
import toast from "react-hot-toast";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", formData);

      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        toast.success("Welcome back!");
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-royal-purple-dark via-royal-purple to-royal-purple-light flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-royal-gold to-royal-gold-light flex items-center justify-center rounded-xl">
            <Sparkles className="w-7 h-7 text-royal-purple" />
          </div>
          <span className="font-display text-2xl text-white tracking-wider">
            MAISON ÉLITE
          </span>
        </Link>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
          <h1 className="font-display text-3xl text-white text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-white/70 text-center mb-8">
            Sign in to access your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              leftIcon={<Mail className="w-5 h-5" />}
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                leftIcon={<Lock className="w-5 h-5" />}
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-10 text-white/60 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-royal-gold focus:ring-royal-gold"
                />
                <span className="text-sm text-white/70">Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-royal-gold hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={loading}>
              Sign In
            </Button>

            <p className="text-center text-white/70 text-sm">
              Don't have an account?{" "}
              <Link href="/register" className="text-royal-gold hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-white/60 text-xs mb-2">Demo Credentials:</p>
            <p className="text-white/80 text-xs">Email: demo@example.com</p>
            <p className="text-white/80 text-xs">Password: password123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
