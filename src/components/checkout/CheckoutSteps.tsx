
import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { CheckoutStep } from '@/types/checkout';

interface CheckoutStepsProps {
  steps: CheckoutStep[];
}

export function CheckoutSteps({ steps }: CheckoutStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                step.completed 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : step.current 
                    ? 'bg-blue-500 border-blue-500 text-white' 
                    : 'border-gray-300 text-gray-400'
              }`}>
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step.current ? 'text-blue-600' : step.completed ? 'text-green-600' : 'text-gray-400'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`mx-4 h-px w-12 ${
                step.completed ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
