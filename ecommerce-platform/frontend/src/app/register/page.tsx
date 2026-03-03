'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@/components/ui';
import { registerSchema, getPasswordStrength } from '@/utils/validators';
import { useAuthStore } from '@/store';
import toast from 'react-hot-toast';
import axios from 'axios';

type RegisterForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');
  const passwordStrength = getPasswordStrength(password);

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/auth/register', {
        email: data.email,
        password: data.password,
        full_name: data.firstName + ' ' + data.lastName,
      });
      if (response.data.success) {
        if (response.data.data?.token) {
          login({
            id: response.data.data.user.id,
            email: response.data.data.user.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: 'customer',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }, response.data.data.token);
          toast.success('Account created! Welcome!');
          router.push('/');
        } else {
          toast.success('Account created! Please check your email to confirm.');
          router.push('/login');
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a2e] to-[#2d1b4e]">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-amber-500 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
          </div>
        </div>
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="text-center">
            <Sparkles className="w-16 h-16 text-amber-400 mx-auto mb-6" />
            <h2 className="font-display text-4xl text-white mb-4">Join the Elite</h2>
            <p className="text-white/70 max-w-md mb-8">
              Create your account and unlock exclusive benefits, personalized 
              recommendations, and a premium shopping experience.
            </p>
            <div className="space-y-4 text-left max-w-sm mx-auto">
              {[
                'AI-powered product recommendations',
                'Exclusive member discounts',
                'Early access to new arrivals',
                'Free shipping on orders over $100',
              ].map((benefit) => (
                <div key={benefit} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-slate-900" />
                  </div>
                  <span className="text-white/80">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-slate-900" />
            </div>
            <span className="font-display text-xl text-slate-900 tracking-wider">
              MAISON ELITE
            </span>
          </Link>

          <h1 className="font-display text-3xl text-slate-900 mb-2">Create Account</h1>
          <p className="text-gray-500 mb-8">Join us and start your luxury shopping journey</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                leftIcon={<User className="w-5 h-5" />}
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail className="w-5 h-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="********"
                leftIcon={<Lock className="w-5 h-5" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
                error={errors.password?.message}
                {...register('password')}
              />
              <p className="text-xs text-gray-400 mt-1">Must be 8+ chars with uppercase, lowercase, number & special character (!@#$...)</p>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color,
                        }}
                      />
                    </div>
                    <span className="text-xs" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <Input
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              leftIcon={<Lock className="w-5 h-5" />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 rounded border-gray-300 text-amber-500 focus:ring-amber-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-amber-600 hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</Link>
              </label>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight className="w-5 h-5" /> : undefined}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-8 text-center text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-amber-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
