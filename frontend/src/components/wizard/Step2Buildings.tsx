"use client";

import { Plus, Trash2, MapPin } from "lucide-react";

export function Step2Buildings({ data, updateData, onNext, onBack }: any) {
    const addBuilding = () => {
        updateData({
            buildings: [
                ...data.buildings,
                { name: "", street: "", houseNumber: "", postcode: "", units: [] }
            ]
        });
    };

    const removeBuilding = (index: number) => {
        if (data.buildings.length === 1) return;
        const newBuildings = [...data.buildings];
        newBuildings.splice(index, 1);
        updateData({ buildings: newBuildings });
    };

    const updateBuilding = (index: number, bData: any) => {
        const newBuildings = [...data.buildings];
        newBuildings[index] = { ...newBuildings[index], ...bData };
        updateData({ buildings: newBuildings });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-4">
                {data.buildings.map((building: any, index: number) => (
                    <div key={index} className="group relative bg-slate-50/50 border border-slate-200 rounded-xl p-6 transition-all hover:border-slate-300">
                        <div className="absolute -left-3 top-6 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm">
                            {index + 1}
                        </div>

                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <h3 className="font-semibold text-sm text-slate-900">Building Information</h3>
                            </div>
                            {data.buildings.length > 1 && (
                                <button
                                    onClick={() => removeBuilding(index)}
                                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 space-y-2">
                                <label className="text-[11px] font-bold text-slate-900 uppercase">Building Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter building name"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                                    value={building.name}
                                    onChange={(e) => updateBuilding(index, { name: e.target.value })}
                                />
                            </div>
                            <div className="col-span-6 space-y-2">
                                <label className="text-[11px] font-bold text-slate-900 uppercase">Street</label>
                                <input
                                    type="text"
                                    placeholder="Street name"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                                    value={building.street}
                                    onChange={(e) => updateBuilding(index, { street: e.target.value })}
                                />
                            </div>
                            <div className="col-span-3 space-y-2">
                                <label className="text-[11px] font-bold text-slate-900 uppercase">Number</label>
                                <input
                                    type="text"
                                    placeholder="Number"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                                    value={building.houseNumber}
                                    onChange={(e) => updateBuilding(index, { houseNumber: e.target.value })}
                                />
                            </div>
                            <div className="col-span-3 space-y-2">
                                <label className="text-[11px] font-bold text-slate-900 uppercase">Postcode</label>
                                <input
                                    type="text"
                                    placeholder="Postcode"
                                    className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm bg-white text-slate-900 placeholder:text-slate-400"
                                    value={building.postcode}
                                    onChange={(e) => updateBuilding(index, { postcode: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={addBuilding}
                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-slate-50/50 transition-all flex items-center justify-center gap-2 text-sm font-bold"
            >
                <Plus className="w-4 h-4" />
                Add Another Building
            </button>

            <div className="flex justify-between pt-8 border-t border-slate-100">
                <button
                    onClick={onBack}
                    className="text-slate-600 px-8 py-2 rounded-lg font-bold hover:text-slate-900 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="bg-slate-900 text-white px-8 py-2 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
                >
                    Continue to Units
                </button>
            </div>
        </div>
    );
}
