"use client";

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type StepProgressBarProps = {
  steps: string[];
  currentStep: number;
  className?: string;
};

export const StepProgressBar = ({ steps, currentStep, className }: StepProgressBarProps) => {
  return (
    <div className={cn("flex items-center justify-center w-full", className)}>
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                    isCompleted ? "bg-black text-white" :
                    isCurrent ? "bg-black text-white ring-4 ring-gray-300" :
                    "bg-gray-200 text-gray-500"
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                <div className={cn("mt-2 text-xs text-center", isCurrent ? "font-bold text-black" : "text-gray-500")}>
                  {step}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={cn("flex-1 h-1 mx-4", isCompleted ? "bg-black" : "bg-gray-200")} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};