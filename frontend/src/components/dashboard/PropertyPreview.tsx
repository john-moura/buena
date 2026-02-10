"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { X, Building2, LayoutGrid, Users, History, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyPreviewProps {
    property: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PropertyPreview({ property, open, onOpenChange }: PropertyPreviewProps) {
    if (!property) return null;

    const totalUnits = property.buildings?.reduce((acc: number, b: any) => acc + (b.units?.length || 0), 0) || 0;
    const totalShare = property.buildings?.reduce((acc: number, b: any) =>
        acc + (b.units?.reduce((uAcc: number, u: any) => uAcc + (parseFloat(u.coOwnershipShare) || 0), 0) || 0)
        , 0) || 0;

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-300" />
                <Dialog.Content className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-500 overflow-y-auto">
                    <div className="p-6 space-y-8">
                        {/* Header */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Dialog.Title className="text-xl font-bold text-slate-900">
                                    Property Preview
                                </Dialog.Title>
                                <Dialog.Description className="sr-only">
                                    Detailed information about {property.name}, including buildings and units.
                                </Dialog.Description>
                                <Dialog.Close className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5 text-slate-500" />
                                </Dialog.Close>
                            </div>
                            <div className="flex gap-3 pb-2 border-b border-slate-100">
                                <Link
                                    href={`/dashboard/edit/${property.id}`}
                                    className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-colors text-center shadow-sm"
                                >
                                    Edit Property
                                </Link>
                                <button
                                    onClick={() => onOpenChange(false)}
                                    className="px-6 bg-white text-slate-600 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-50 border border-slate-200 transition-colors shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </div>

                        {/* Property Basic Info */}
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <div className="flex items-center gap-3 mb-1">
                                    <Building2 className="w-4 h-4 text-slate-400" />
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Property Name</span>
                                </div>
                                <p className="text-lg font-bold text-slate-900">{property.name}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Info className="w-4 h-4 text-slate-400" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Management</span>
                                    </div>
                                    <p className="font-semibold text-slate-900">{property.managementType}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <History className="w-4 h-4 text-slate-400" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">ID Ref</span>
                                    </div>
                                    <p className="font-mono text-sm text-slate-600">{property.id.slice(0, 8)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Users className="w-4 h-4 text-slate-400" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Manager</span>
                                    </div>
                                    <p className="font-semibold text-slate-900 truncate">{property.manager?.name || 'Not set'}</p>
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-1">
                                        <Building2 className="w-4 h-4 text-slate-400" />
                                        <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Accountant</span>
                                    </div>
                                    <p className="font-semibold text-slate-900 truncate">{property.accountant?.name || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 bg-slate-900 rounded-xl text-white">
                                <LayoutGrid className="w-5 h-5 text-slate-400 mb-3" />
                                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-1">Total Units</p>
                                <p className="text-2xl font-bold">{totalUnits}</p>
                            </div>
                            <div className="p-6 bg-emerald-600 rounded-xl text-white">
                                <Users className="w-5 h-5 text-emerald-200 mb-3" />
                                <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 mb-1">Total Share</p>
                                <p className="text-2xl font-bold">{totalShare.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                            </div>
                        </div>

                        {/* Buildings & Units Detail */}
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                <LayoutGrid className="w-4 h-4 text-slate-400" />
                                Buildings & Units
                            </h3>
                            <div className="space-y-6">
                                {property.buildings?.map((building: any, bIdx: number) => (
                                    <div key={bIdx} className="space-y-3">
                                        <div className="flex items-end justify-between border-b border-slate-100 pb-2">
                                            <div>
                                                {building.name && (
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{building.name}</p>
                                                )}
                                                <p className="text-sm font-bold text-slate-900">{building.street} {building.houseNumber}</p>
                                                <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">{building.postcode} Berlin</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {building.units?.length || 0} UNITS
                                            </span>
                                        </div>

                                        <div className="bg-slate-50/50 rounded-xl border border-slate-100 divide-y divide-slate-100">
                                            {building.units?.length > 0 ? (
                                                building.units.map((unit: any, uIdx: number) => (
                                                    <div key={uIdx} className="p-3 flex items-center justify-between text-xs group hover:bg-white transition-colors">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-6 h-6 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                                                                {unit.unitNumber}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-slate-900">{unit.type}</p>
                                                                <p className="text-[10px] text-slate-400">
                                                                    Floor {unit.floor} • {unit.rooms || 'N/A'} Rooms • {unit.constructionYear || 'Year N/A'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-bold text-slate-900">{unit.sizeSqM} m²</p>
                                                            <p className="text-[10px] text-slate-400 font-mono">{(parseFloat(unit.coOwnershipShare) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} share</p>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="p-4 text-center text-slate-400 text-xs">No units available</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
