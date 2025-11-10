import React from "react";

export default function RevenueCards() {
    return (
        <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1 rounded-xl border-4 border-white bg-accent p-4 pb-0 shadow shadow-black/25">
                <div className="flex items-start justify-between text-white">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs">Revenue for professional fee</p>
                        <h4 className="text-2xl font-bold">PHP 882,500.00</h4>
                    </div>
                    <p className="text-xs text-white/30">KLINICARE</p>
                </div>
                <img
                    src="/assets/icons/flat-chart-icon.svg"
                    alt="chart icon"
                    className="ml-auto"
                    width={100}
                    height={100}
                />
            </div>
            <div className="flex-1 rounded-xl border-4 border-white bg-[#DDE8E9] p-4 pb-0 shadow shadow-black/25">
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <p className="text-xs">Revenue for medicine</p>
                        <h4 className="text-2xl font-bold">PHP 882,500.00</h4>
                    </div>
                    <p className="text-xs text-accent/30">KLINICARE</p>
                </div>
                <div className="flex items-end justify-between">
                    <p className="pb-2 text-xs">
                        GARCIA MEDICAL CLINIC MEDICINE
                    </p>
                    <img
                        src="/assets/icons/chart-icon.svg"
                        alt="chart icon"
                        className="ml-auto"
                        width={100}
                        height={100}
                    />
                </div>
            </div>
        </div>
    );
}
