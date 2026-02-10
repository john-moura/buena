"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Plus, Search, Filter, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { PropertyPreview } from "@/components/dashboard/PropertyPreview";
import { useSearchParams } from "next/navigation";
import { Toast, ToastTitle, ToastDescription, ToastClose, useToast } from "@/components/ui/Toast";

function DashboardContent() {
    const searchParams = useSearchParams();
    const { toast, open, setOpen, title, description } = useToast();
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [previewOpen, setPreviewOpen] = useState(false);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await axios.get("http://localhost:3001/properties");
                setProperties(res.data);

                // Handle deep-linked preview
                const previewId = searchParams.get("preview");
                if (previewId) {
                    const property = res.data.find((p: any) => p.id === previewId);
                    if (property) {
                        setSelectedProperty(property);
                        setPreviewOpen(true);
                    }
                }

                // Handle success toast
                const successType = searchParams.get("success");
                if (successType === "created") {
                    toast({
                        title: "Property Created!",
                        description: "The new property has been successfully registered."
                    });
                } else if (successType === "updated") {
                    toast({
                        title: "Property Updated!",
                        description: "The property details have been successfully saved."
                    });
                }
            } catch (err) {
                console.error("Failed to fetch properties", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProperties();
    }, [searchParams, toast]);

    const filteredProperties = properties.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <Toast open={open} onOpenChange={setOpen} variant="success">
                <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <div className="grid gap-1">
                        <ToastTitle>{title}</ToastTitle>
                        <ToastDescription>{description}</ToastDescription>
                    </div>
                </div>
                <ToastClose />
            </Toast>

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Properties</h1>
                    <p className="text-slate-500">Manage and oversee all your real estate assets.</p>
                </div>
                <Link
                    href="/dashboard/create"
                    className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Create New Property
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search properties..."
                            className="w-full pl-10 pr-4 py-2 rounded-md border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm text-slate-900 placeholder:text-slate-500"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Property Name</th>
                                <th className="px-6 py-4">Property ID</th>
                                <th className="px-6 py-4">Management Type</th>
                                <th className="px-6 py-4">Units</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading properties...</td>
                                </tr>
                            ) : filteredProperties.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No properties found.</td>
                                </tr>
                            ) : (
                                filteredProperties.map((property) => (
                                    <tr
                                        key={property.id}
                                        className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                        onClick={() => {
                                            setSelectedProperty(property);
                                            setPreviewOpen(true);
                                        }}
                                    >
                                        <td className="px-6 py-4 font-medium text-slate-900">{property.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-2 py-1 rounded truncate block max-w-[80px]">
                                                {property.id.slice(0, 8)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-900">
                                            {property.managementType}
                                        </td>
                                        <td className="px-6 py-4 text-slate-900">
                                            {property.buildings?.reduce((acc: number, b: any) => acc + (b.units?.length || 0), 0) || 0}
                                        </td>
                                        <td className="px-6 py-4 text-right text-slate-400 space-x-3">
                                            <Link
                                                href={`/dashboard/edit/${property.id}`}
                                                className="hover:text-amber-600 transition-colors font-medium text-xs relative z-10"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="hover:text-slate-900 transition-colors font-medium text-xs opacity-0 group-hover:opacity-100"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PropertyPreview
                property={selectedProperty}
                open={previewOpen}
                onOpenChange={setPreviewOpen}
            />
        </div>
    );
}

export default function DashboardPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
            </div>
        }>
            <DashboardContent />
        </Suspense>
    );
}
