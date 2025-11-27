import React, { useState, useEffect } from 'react';
import { Check, Loader2, ShieldCheck, CreditCard } from 'lucide-react';

interface MockPaymentModalProps {
    sku: string;
    onComplete: () => void;
    onClose: () => void;
}

export const MockPaymentModal: React.FC<MockPaymentModalProps> = ({ sku, onComplete, onClose }) => {
    const [step, setStep] = useState<'processing' | 'success'>('processing');

    useEffect(() => {
        const timer = setTimeout(() => {
            setStep('success');
            setTimeout(() => {
                onComplete();
            }, 1500);
        }, 2000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    const getProductDetails = (sku: string) => {
        switch (sku) {
            case 'remove_ads': return { name: 'Remove Ads', price: '$4.99' };
            case 'coins_small': return { name: 'Small Coin Pack', price: '$1.99' };
            case 'coins_big': return { name: 'Big Coin Pack', price: '$9.99' };
            default: return { name: 'Unknown Item', price: '$0.99' };
        }
    };

    const product = getProductDetails(sku);

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
            <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl transform transition-all scale-100">
                {/* Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                        <ShieldCheck className="text-green-600" size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-gray-900">Secure Payment</div>
                        <div className="text-xs text-gray-500">Google Play Store (Mock)</div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
                    {step === 'processing' ? (
                        <>
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-75" />
                                <div className="relative bg-white p-4 rounded-full shadow-lg border border-gray-100">
                                    <Loader2 className="text-blue-600 animate-spin" size={48} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Processing...</h3>
                            <p className="text-gray-500 text-center text-sm">
                                Purchasing <span className="font-bold text-gray-700">{product.name}</span>
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="mb-6 bg-green-100 p-4 rounded-full animate-bounce-short">
                                <Check className="text-green-600" size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                            <p className="text-gray-500 text-center text-sm">
                                You are all set.
                            </p>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <CreditCard size={12} />
                        <span>**** 1234</span>
                    </div>
                    <div className="font-bold text-gray-900 text-lg">{product.price}</div>
                </div>
            </div>
        </div>
    );
};
