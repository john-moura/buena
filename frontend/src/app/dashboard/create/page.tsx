"use client";

import { useState } from "react";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { Step1General } from "@/components/wizard/Step1General";
import { Step2Buildings } from "@/components/wizard/Step2Buildings";
import { Step3Units } from "@/components/wizard/Step3Units";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreatePropertyPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        managementType: "WEG",
        managerName: "",
        accountantName: "",
        buildings: [
            {
                name: "",
                street: "",
                houseNumber: "",
                postcode: "",
                units: []
            }
        ]
    });

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const updateFormData = (newData: any) => {
        setFormData(prev => ({ ...prev, ...newData }));
    };

    const handleFinish = async () => {
        setIsSaving(true);
        try {
            const res = await axios.post("http://localhost:3001/properties", formData);
            router.push(`/dashboard?preview=${res.data.id}&success=created`);
        } catch (err) {
            console.error("Failed to create property", err);
            setIsSaving(false);
        }
    };

    return (
        <div className="w-full space-y-8 pb-20">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create New Property</h1>
                <p className="text-slate-500">Follow the steps to set up your new property.</p>
            </div>

            <WizardProgress currentStep={step} />

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                {step === 1 && (
                    <Step1General
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                    />
                )}
                {step === 2 && (
                    <Step2Buildings
                        data={formData}
                        updateData={updateFormData}
                        onNext={nextStep}
                        onBack={prevStep}
                    />
                )}
                {step === 3 && (
                    <Step3Units
                        data={formData}
                        updateData={updateFormData}
                        onFinish={handleFinish}
                        onBack={prevStep}
                        isSaving={isSaving}
                    />
                )}
            </div>
        </div>
    );
}
