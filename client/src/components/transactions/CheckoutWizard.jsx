import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function CheckoutWizard({ listing }) {
  const [activeStep, setActiveStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('');

  const steps = [
    { number: 1, title: 'Review Order' },
    { number: 2, title: 'Payment Method' },
    { number: 3, title: 'Complete Purchase' }
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between mb-8">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                activeStep >= step.number ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
            >
              {step.number}
            </div>
            <span className="mt-2 text-sm text-center">{step.title}</span>
          </div>
        ))}
      </div>

      {activeStep === 1 && (
        <div className="space-y-6">
          <OrderSummary listing={listing} />
          <button
            onClick={() => setActiveStep(2)}
            className="btn-primary w-full"
          >
            Continue to Payment
          </button>
        </div>
      )}

      {activeStep === 2 && (
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            listing={listing}
            onSuccess={() => setActiveStep(3)}
          />
        </Elements>
      )}

      {activeStep === 3 && (
        <div className="text-center space-y-4">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h2 className="text-2xl font-bold">Payment Successful!</h2>
          <p>Your transaction ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          <p>Seller will contact you to arrange pickup/delivery</p>
        </div>
      )}
    </div>
  );
}