"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Trash2, Copy, Zap, Info, Building2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const UNIT_TYPES = ["Apartment", "Office", "Garden", "Parking"];

export function Step3Units({ data, updateData, onFinish, onBack, isSaving }: any) {
    // We update the units directly within the data.buildings array

    useEffect(() => {
        // Ensure every building has at least one unit initially if it has none
        const newBuildings = data.buildings.map((b: any) => {
            if (!b.units || b.units.length === 0) {
                return {
                    ...b,
                    units: [{
                        unitNumber: "1",
                        type: "Apartment",
                        floor: "1",
                        entrance: "Main",
                        sizeSqM: "",
                        coOwnershipShare: "",
                        constructionYear: "",
                        rooms: ""
                    }]
                };
            }
            return b;
        });

        // Only update if changes were actually made to prevent infinite loops
        const hasChanges = newBuildings.some((b: any, i: number) =>
            !data.buildings[i].units || data.buildings[i].units.length !== b.units.length
        );

        if (hasChanges) {
            updateData({ buildings: newBuildings });
        }
    }, []);

    const addUnit = (buildingIdx: number) => {
        const newBuildings = [...data.buildings];
        const building = newBuildings[buildingIdx];
        const units = building.units || [];
        const lastUnit = units[units.length - 1];
        const nextNumber = lastUnit ? (parseInt(lastUnit.unitNumber) + 1).toString() : "1";

        const newUnit = {
            unitNumber: isNaN(parseInt(nextNumber)) ? "" : nextNumber,
            type: "Apartment",
            floor: lastUnit?.floor || "1",
            entrance: lastUnit?.entrance || "Main",
            sizeSqM: "",
            coOwnershipShare: "",
            constructionYear: lastUnit?.constructionYear || "",
            rooms: lastUnit?.rooms || ""
        };

        newBuildings[buildingIdx] = {
            ...building,
            units: [...units, newUnit]
        };
        updateData({ buildings: newBuildings });
    };

    const removeUnit = (buildingIdx: number, unitIdx: number) => {
        const newBuildings = [...data.buildings];
        const building = newBuildings[buildingIdx];
        const newUnits = [...building.units];
        newUnits.splice(unitIdx, 1);

        newBuildings[buildingIdx] = { ...building, units: newUnits };
        updateData({ buildings: newBuildings });
    };

    const updateUnit = (buildingIdx: number, unitIdx: number, field: string, value: any) => {
        const newBuildings = [...data.buildings];
        const building = newBuildings[buildingIdx];
        const newUnits = [...building.units];
        newUnits[unitIdx] = { ...newUnits[unitIdx], [field]: value };

        newBuildings[buildingIdx] = { ...building, units: newUnits };
        updateData({ buildings: newBuildings });
    };

    const duplicateUnit = (buildingIdx: number, unitIdx: number) => {
        const newBuildings = [...data.buildings];
        const building = newBuildings[buildingIdx];
        const unitToCopy = building.units[unitIdx];
        const newUnits = [...building.units];
        const nextNum = (parseInt(unitToCopy.unitNumber) + 1).toString();

        newUnits.splice(unitIdx + 1, 0, {
            ...unitToCopy,
            id: undefined, // Clear ID if it's an edit mode duplication
            unitNumber: isNaN(parseInt(nextNum)) ? unitToCopy.unitNumber + " (Copy)" : nextNum
        });

        newBuildings[buildingIdx] = { ...building, units: newUnits };
        updateData({ buildings: newBuildings });
    };

    const autoIncrement = (buildingIdx: number) => {
        const newBuildings = [...data.buildings];
        const building = newBuildings[buildingIdx];
        const units = building.units;
        if (units.length < 2) return;

        const startNum = parseInt(units[0].unitNumber);
        if (isNaN(startNum)) return;

        const newUnits = units.map((u: any, i: number) => ({
            ...u,
            unitNumber: (startNum + i).toString()
        }));

        newBuildings[buildingIdx] = { ...building, units: newUnits };
        updateData({ buildings: newBuildings });
    };

    const calculateStats = (units: any[]) => {
        const count = units?.length || 0;
        const share = units?.reduce((acc: number, u: any) => acc + (parseFloat(u.coOwnershipShare) || 0), 0) || 0;
        return { count, share };
    };

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-500">
            {data.buildings.map((building: any, bIdx: number) => {
                const { count, share } = calculateStats(building.units);

                return (
                    <div key={bIdx} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                                    <Building2 className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{building.street} {building.houseNumber}</h3>
                                    <p className="text-xs text-slate-500 font-medium">
                                        {building.postcode} • {building.name || `Building ${bIdx + 1}`}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => autoIncrement(bIdx)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md hover:bg-amber-100 transition-colors"
                                title="Sequentially number all units for this building"
                            >
                                <Zap className="w-3 h-3" />
                                Auto-Increment No.
                            </button>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] font-bold tracking-wider">
                                    <tr>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 w-32">Bldg</th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 w-16">No.</th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 w-32">Type</th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 w-24">Floor</th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 w-20">Entrance</th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 w-20">Size (m²)</th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 w-24">Share</th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 w-20">Year</th>
                                        <th className="px-4 py-3 border-b border-r border-slate-200 w-16">Rooms</th>
                                        <th className="px-4 py-3 border-b border-slate-200 text-right w-24">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(building.units || []).map((unit: any, uIdx: number) => (
                                        <tr key={uIdx} className="group hover:bg-slate-50/50 transition-colors">
                                            <td className="px-3 py-3 border-b border-r border-slate-200 text-[10px] text-slate-500 font-medium truncate max-w-[80px]" title={building.name || `${building.street} ${building.houseNumber}`}>
                                                {building.name || `${building.street} ${building.houseNumber}`}
                                            </td>
                                            <td className="p-0 border-b border-r border-slate-200">
                                                <input
                                                    type="text"
                                                    className="w-full px-1 py-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-900 bg-transparent text-center text-slate-900"
                                                    value={unit.unitNumber}
                                                    onChange={(e) => updateUnit(bIdx, uIdx, "unitNumber", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-0 border-b border-r border-slate-200">
                                                <select
                                                    className="w-full px-4 py-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-900 bg-transparent appearance-none text-slate-900"
                                                    value={unit.type}
                                                    onChange={(e) => updateUnit(bIdx, uIdx, "type", e.target.value)}
                                                >
                                                    {UNIT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                </select>
                                            </td>
                                            <td className="p-0 border-b border-r border-slate-200">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-900 bg-transparent text-center text-slate-900"
                                                    value={unit.floor}
                                                    onChange={(e) => updateUnit(bIdx, uIdx, "floor", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-0 border-b border-r border-slate-200">
                                                <input
                                                    type="text"
                                                    className="w-full px-2 py-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-900 bg-transparent text-center text-slate-900"
                                                    value={unit.entrance}
                                                    onChange={(e) => updateUnit(bIdx, uIdx, "entrance", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-0 border-b border-r border-slate-200">
                                                <input
                                                    type="number"
                                                    className="w-full px-2 py-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-900 bg-transparent text-right text-slate-900"
                                                    placeholder="0.00"
                                                    value={unit.sizeSqM ?? ""}
                                                    onChange={(e) => updateUnit(bIdx, uIdx, "sizeSqM", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-0 border-b border-r border-slate-200">
                                                <input
                                                    type="number"
                                                    className="w-full px-2 py-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-900 bg-transparent text-right text-slate-900"
                                                    placeholder="0.00"
                                                    value={unit.coOwnershipShare ?? ""}
                                                    onChange={(e) => updateUnit(bIdx, uIdx, "coOwnershipShare", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-0 border-b border-r border-slate-200">
                                                <input
                                                    type="number"
                                                    className="w-full px-2 py-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-900 bg-transparent text-center text-slate-900"
                                                    placeholder="2024"
                                                    value={unit.constructionYear ?? ""}
                                                    onChange={(e) => updateUnit(bIdx, uIdx, "constructionYear", e.target.value)}
                                                />
                                            </td>
                                            <td className="p-0 border-b border-r border-slate-200">
                                                <input
                                                    type="number"
                                                    step="0.5"
                                                    className="w-full px-2 py-3 focus:bg-white focus:outline-none focus:ring-1 focus:ring-inset focus:ring-slate-900 bg-transparent text-center text-slate-900"
                                                    placeholder="2.0"
                                                    value={unit.rooms ?? ""}
                                                    onChange={(e) => updateUnit(bIdx, uIdx, "rooms", e.target.value)}
                                                />
                                            </td>
                                            <td className="px-4 py-2 border-b border-slate-200 text-right space-x-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => duplicateUnit(bIdx, uIdx)}
                                                    className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-md transition-all shadow-sm border border-transparent hover:border-slate-200"
                                                    title="Duplicate Row"
                                                >
                                                    <Copy className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => removeUnit(bIdx, uIdx)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white rounded-md transition-all shadow-sm border border-transparent hover:border-slate-200"
                                                    title="Delete Row"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <button
                                onClick={() => addUnit(bIdx)}
                                className="w-full py-4 bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-white transition-all flex items-center justify-center gap-2 text-xs font-bold"
                            >
                                <Plus className="w-4 h-4" />
                                Add New Unit Row
                            </button>
                        </div>

                        <div className="flex items-center justify-between bg-slate-900 text-white p-4 rounded-xl shadow-lg mt-2">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-slate-400" />
                                <p className="text-xs text-slate-100">Total units: <span className="text-white font-bold">{count}</span></p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-200">Total Co-ownership Share</p>
                                <p className="text-xl font-mono font-bold">{share.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="flex justify-between pt-8 border-t border-slate-100">
                <button
                    onClick={onBack}
                    className="text-slate-600 px-8 py-2 rounded-lg font-bold hover:text-slate-900 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={onFinish}
                    disabled={isSaving}
                    className="bg-emerald-600 text-white px-8 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {data.id ? "Update Property" : "Create Property"}
                </button>
            </div>
        </div>
    );
}
