"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    { id: 1, name: "General Info", description: "Property details & AI upload" },
    { id: 2, name: "Buildings", description: "Address & metadata" },
    { id: 3, name: "Units", description: "Unit list & shares" },
];

export function WizardProgress({ currentStep }: { currentStep: number }) {
    return (
        <div className="grid grid-cols-3 gap-4">
            {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isActive = currentStep === step.id;

                return (
                    <div
                        key={step.id}
                        className={cn(
                            "flex flex-col gap-2 p-4 rounded-lg border transition-all",
                            isActive
                                ? "bg-white border-slate-900 shadow-md ring-1 ring-slate-900"
                                : isCompleted
                                    ? "bg-slate-50 border-slate-200 text-slate-500"
                                    : "bg-white border-slate-200 text-slate-400"
                        )}
                    >
                        <div className="flex items-center gap-2">
                            <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                                isActive
                                    ? "bg-slate-900 text-white"
                                    : isCompleted
                                        ? "bg-emerald-500 text-white"
                                        : "border-2 border-slate-200"
                            )}>
                                {isCompleted ? <Check className="w-3 h-3" /> : step.id}
                            </div>
                            <span className={cn(
                                "font-semibold text-sm",
                                isActive ? "text-slate-900" : "text-slate-500"
                            )}>
                                {step.name}
                            </span>
                        </div>
                        <p className={cn(
                            "text-[11px] leading-tight",
                            isActive ? "text-slate-600" : isCompleted ? "text-slate-500" : "text-slate-400"
                        )}>
                            {step.description}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}
