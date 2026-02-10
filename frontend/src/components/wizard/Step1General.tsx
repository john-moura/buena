import { useState, useEffect } from "react";
import { Upload, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axios from "axios";
import { cn } from "@/lib/utils";

export function Step1General({ data, updateData, onNext }: any) {
    const [isExtracting, setIsExtracting] = useState(false);
    const [extractStatus, setExtractStatus] = useState<"idle" | "success" | "error">("idle");
    const [managers, setManagers] = useState<any[]>([]);
    const [accountants, setAccountants] = useState<any[]>([]);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const [mRes, aRes] = await Promise.all([
                    axios.get("http://localhost:3001/properties/contacts/managers"),
                    axios.get("http://localhost:3001/properties/contacts/accountants")
                ]);
                setManagers(mRes.data);
                setAccountants(aRes.data);
            } catch (err) {
                console.error("Failed to fetch contacts", err);
            }
        };
        fetchContacts();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsExtracting(true);
        setExtractStatus("idle");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:3001/properties/extract", formData);
            const extractedData = res.data;

            // Map extracted names to IDs if possible, or just keep names
            updateData({
                ...extractedData,
                managerId: managers.find(m => m.name === extractedData.managerName)?.id || data.managerId,
                accountantId: accountants.find(a => a.name === extractedData.accountantName)?.id || data.accountantId
            });

            setExtractStatus("success");
        } catch (err) {
            console.error("AI Extraction failed", err);
            setExtractStatus("error");
        } finally {
            setIsExtracting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-900">Management Type</label>
                        <div className="flex bg-slate-100 p-1 rounded-lg w-fit">
                            <button
                                onClick={() => updateData({ managementType: "WEG" })}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                                    data.managementType === "WEG" ? "bg-white shadow-sm text-slate-900" : "text-slate-600"
                                )}
                            >
                                WEG
                            </button>
                            <button
                                onClick={() => updateData({ managementType: "MV" })}
                                className={cn(
                                    "px-4 py-1.5 rounded-md text-xs font-bold transition-all",
                                    data.managementType === "MV" ? "bg-white shadow-sm text-slate-900" : "text-slate-600"
                                )}
                            >
                                MV
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-900">Property Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Buena Living Berlin"
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm text-slate-900 placeholder:text-slate-400"
                            value={data.name}
                            onChange={(e) => updateData({ name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900">Manager</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm appearance-none bg-white text-slate-900"
                                value={data.managerId || ""}
                                onChange={(e) => updateData({ managerId: e.target.value })}
                            >
                                <option value="">Select Manager</option>
                                {managers.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-900">Accountant</label>
                            <select
                                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm appearance-none bg-white text-slate-900"
                                value={data.accountantId || ""}
                                onChange={(e) => updateData({ accountantId: e.target.value })}
                            >
                                <option value="">Select Accountant</option>
                                {accountants.map(a => (
                                    <option key={a.id} value={a.id}>{a.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 block">AI Property Extraction</label>
                    <div
                        className={cn(
                            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative overflow-hidden",
                            extractStatus === "success" ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 hover:border-slate-400 bg-slate-50/50"
                        )}
                        onClick={() => document.getElementById("file-upload")?.click()}
                    >
                        <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            disabled={isExtracting}
                        />
                        {isExtracting ? (
                            <div className="space-y-3">
                                <Loader2 className="w-10 h-10 text-slate-900 animate-spin mx-auto" />
                                <div>
                                    <p className="font-bold text-sm text-slate-900">Processing with AI...</p>
                                    <p className="text-[11px] text-slate-700 font-medium">Extracting units and building data from PDF</p>
                                </div>
                            </div>
                        ) : extractStatus === "success" ? (
                            <div className="space-y-2">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                                <div>
                                    <p className="font-semibold text-sm text-emerald-700">Extraction Complete</p>
                                    <p className="text-[11px] text-emerald-600">Property, buildings, and units pre-filled</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                                    <Upload className="w-5 h-5 text-slate-900" />
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-sm text-slate-900">Upload Declaration of Division</p>
                                    <p className="text-[11px] text-slate-700 font-medium">PDF documents only. Max 20MB.</p>
                                </div>
                            </>
                        )}
                        {extractStatus === "error" && (
                            <div className="mt-4 flex items-center gap-2 text-rose-600 text-[11px] font-medium bg-rose-50 px-3 py-1 rounded-full">
                                <AlertCircle className="w-3 h-3" />
                                Failed to extract data. Please try again.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-slate-100">
                <button
                    onClick={onNext}
                    disabled={!data.name || isExtracting}
                    className="bg-slate-900 text-white px-8 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Continue to Buildings
                </button>
            </div>
        </div>
    );
}
