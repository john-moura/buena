"use client";

import { useState, useEffect } from "react";
import { WizardProgress } from "@/components/wizard/WizardProgress";
import { Step1General } from "@/components/wizard/Step1General";
import { Step2Buildings } from "@/components/wizard/Step2Buildings";
import { Step3Units } from "@/components/wizard/Step3Units";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";

export default function EditPropertyPage() {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/properties/${id}`);
                setFormData(res.data);
            } catch (err) {
                console.error("Failed to fetch property", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperty();
    }, [id]);

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const updateFormData = (newData: any) => {
        setFormData((prev: any) => ({ ...prev, ...newData }));
    };

    const handleFinish = async () => {
        setIsSaving(true);
        try {
            await axios.patch(`http://localhost:3001/properties/${id}`, formData);
            router.push(`/dashboard?preview=${id}&success=updated`);
        } catch (err) {
            console.error("Failed to update property", err);
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
                <p className="text-slate-500 font-medium">Loading property data...</p>
            </div>
        );
    }

    if (!formData) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500">Property not found.</p>
                <button onClick={() => router.push("/dashboard")} className="mt-4 text-slate-900 font-bold">Return to Dashboard</button>
            </div>
        );
    }

    return (
        <div className="w-full space-y-8 pb-20 mt-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Property</h1>
                <p className="text-slate-500">Modify the property details, buildings, or units.</p>
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
