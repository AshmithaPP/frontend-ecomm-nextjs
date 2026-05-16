"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePayment } from '@/store/paymentStore';
import { useOrderStore } from '@/store/orderStore';
import { toast } from 'react-toastify';
import Image from 'next/image';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Assets
import orderIcon3 from 'assets/icons/ui/orderIcon3.png';

const PaymentContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const { initiateRazorpayPayment, loading, error } = usePayment();
    const { currentOrder, fetchOrderDetails } = useOrderStore();
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId).finally(() => setInitializing(false));
        } else {
            setInitializing(false);
        }
    }, [orderId, fetchOrderDetails]);

    const handleRetryPayment = async () => {
        if (!orderId) return;
        const result = await initiateRazorpayPayment(orderId);
        if (result.success) {
            toast.success('Payment successful!');
            router.push(`/order-confirmation/${orderId}`);
        } else if (result.message !== 'Payment cancelled') {
            toast.error(result.message || 'Payment failed');
        }
    };

    if (initializing) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A42829]"></div>
                <p className="mt-4 text-gray-600">Initializing payment session...</p>
            </div>
        );
    }

    if (!orderId) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-2xl font-bold text-gray-800">Invalid Payment Session</h1>
                <p className="mt-2 text-gray-600">No order ID provided. Please go back to checkout.</p>
                <button 
                    onClick={() => router.push('/cart')}
                    className="mt-6 bg-[#A42829] text-white px-8 py-3 rounded-md hover:bg-[#851e1f] transition-all"
                >
                    Return to Cart
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 max-w-2xl">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="bg-[#A42829] p-6 text-white text-center">
                    <div className="flex justify-center mb-3">
                        <Image src={orderIcon3} alt="Secure" width={40} height={40} className="invert" />
                    </div>
                    <h1 className="text-2xl font-semibold">Secure Payment</h1>
                    <p className="text-white/80 text-sm mt-1">Order ID: {orderId}</p>
                </div>

                <div className="p-8">
                    {currentOrder && (
                        <div className="mb-8 bg-gray-50 rounded-lg p-6 border border-gray-100">
                            <h2 className="text-lg font-medium text-gray-800 mb-4 border-bottom pb-2">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{currentOrder.subtotal?.toLocaleString('en-IN')}</span>
                                </div>
                                {currentOrder.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>- ₹{currentOrder.discount?.toLocaleString('en-IN')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>{currentOrder.shipping_charge === 0 ? 'FREE' : `₹${currentOrder.shipping_charge?.toLocaleString('en-IN')}`}</span>
                                </div>
                                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t border-gray-200">
                                    <span>Total Amount</span>
                                    <span>₹{currentOrder.total_amount?.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="text-center">
                        <p className="text-gray-500 text-sm mb-6">
                            By clicking below, you will be redirected to our secure payment partner Razorpay to complete your purchase.
                        </p>
                        
                        <button
                            onClick={handleRetryPayment}
                            disabled={loading}
                            className={`w-full py-4 rounded-lg text-lg font-semibold text-white shadow-lg transform transition-all active:scale-95 ${
                                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#A42829] hover:bg-[#851e1f] hover:shadow-xl'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                                    Processing...
                                </span>
                            ) : (
                                `PAY ₹${currentOrder?.total_amount?.toLocaleString('en-IN') || ''} NOW`
                            )}
                        </button>

                        <button 
                            onClick={() => router.push('/orders')}
                            className="mt-4 text-gray-500 hover:text-[#A42829] text-sm font-medium transition-colors"
                        >
                            Pay Later / Manage Orders
                        </button>
                    </div>
                </div>

                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-center items-center gap-6">
                    <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-widest">
                        <span className="mr-2">Verified by</span>
                        <span className="font-bold">Razorpay</span>
                    </div>
                    <div className="flex items-center text-[10px] text-gray-400 uppercase tracking-widest">
                        <span className="mr-2">Secure</span>
                        <span className="font-bold">SSL Encryption</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PaymentPage() {
    return (
        <ProtectedRoute>
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A42829]"></div>
                </div>
            }>
                <PaymentContent />
            </Suspense>
        </ProtectedRoute>
    );
}
