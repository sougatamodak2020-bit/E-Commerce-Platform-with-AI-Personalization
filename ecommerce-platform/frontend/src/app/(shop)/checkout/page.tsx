"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CreditCard, Lock, Truck, ArrowLeft } from "lucide-react";
import { Header, Footer } from "@/components/layout";
import { Button, Input } from "@/components/ui";
import { useCartStore, useAuthStore } from "@/store";
import { formatCurrency } from "@/utils/formatters";
import toast from "react-hot-toast";
import axios from "axios";
import { supabaseClient } from "@/lib/supabase-client";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "USA",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (!mounted) return null;

  const handlePlaceOrder = async () => {
    setLoading(true);

    try {
      // Get auth token from supabase client
      const { data: { session } } = await supabaseClient.auth.getSession();
      console.log('[Checkout] Session:', session?.user?.id ?? 'NONE');

      if (!session) {
        toast.error("Please login to place an order");
        router.push("/login?redirect=/checkout");
        return;
      }

      const orderData = {
        items,
        subtotal: useCartStore.getState().getSubtotal(),
        tax: useCartStore.getState().getTax(),
        shipping: useCartStore.getState().getShipping(),
        discount: useCartStore.getState().discount,
        total: getTotal(),
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod,
      };

      const response = await axios.post("/api/orders", orderData, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/checkout/success?orderId=${response.data.data.id}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-royal-cream">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-12">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-royal-gold hover:text-royal-gold-dark mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </button>

        <h1 className="font-display text-4xl text-royal-charcoal mb-8">
          Checkout
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <Truck className="w-6 h-6 text-royal-gold" />
                <h2 className="font-semibold text-xl">Shipping Address</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={shippingAddress.firstName}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      firstName: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="Last Name"
                  value={shippingAddress.lastName}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      lastName: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="Address Line 1"
                  value={shippingAddress.address1}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address1: e.target.value,
                    })
                  }
                  className="md:col-span-2"
                  required
                />
                <Input
                  label="Address Line 2"
                  value={shippingAddress.address2}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address2: e.target.value,
                    })
                  }
                  className="md:col-span-2"
                />
                <Input
                  label="City"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      city: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="State"
                  value={shippingAddress.state}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      state: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="Postal Code"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      postalCode: e.target.value,
                    })
                  }
                  required
                />
                <Input
                  label="Phone"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      phone: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <CreditCard className="w-6 h-6 text-royal-gold" />
                <h2 className="font-semibold text-xl">Payment Method</h2>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-royal-gold transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-royal-gold"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">
                      Visa, Mastercard, Amex
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-royal-gold transition-colors">
                  <input
                    type="radio"
                    name="payment"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-royal-gold"
                  />
                  <div className="flex-1">
                    <p className="font-medium">PayPal</p>
                    <p className="text-sm text-gray-500">
                      Pay with your PayPal account
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="font-semibold text-xl mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(useCartStore.getState().getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(useCartStore.getState().getShipping())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>{formatCurrency(useCartStore.getState().getTax())}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 mb-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-royal-gold">
                  {formatCurrency(getTotal())}
                </span>
              </div>

              <Button
                fullWidth
                size="lg"
                onClick={handlePlaceOrder}
                isLoading={loading}
                leftIcon={<Lock className="w-5 h-5" />}
              >
                Place Order
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
