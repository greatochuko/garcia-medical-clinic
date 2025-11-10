import React from "react";
import {
    PieChart,
    expenses,
    expenseNames,
    getExpenseAmount,
    totalExpenses,
} from "./Stats";

export default function MonthlyExpenses() {
    return (
        <div className="flex-[1.5] divide-y-2 divide-accent-200 rounded-md bg-white shadow shadow-black/25">
            <div className="relative p-4 pb-6">
                <h3 className="text-center text-sm font-bold">
                    MONTHLY EXPENSES
                </h3>
                <select
                    name="month"
                    id="month"
                    className="absolute right-4 top-full -translate-y-1/2 rounded-md border border-[#DFDFDF] px-2 py-1 pr-8 text-[13px]"
                >
                    <option value="">November 2025</option>
                </select>
            </div>
            <div className="flex flex-1 flex-col gap-4 p-4 pt-6">
                <p className="flex items-center gap-2 text-xs">
                    <img src="/assets/icons/info-icon.svg" alt="info icon" />
                    Monthly expenses monitor are calculated on a monthly basis.
                </p>

                <div className="flex gap-4">
                    <div className="flex flex-1 flex-col items-center gap-2">
                        <PieChart expenses={expenses} />
                        <button className="flex items-center gap-2 rounded-md border border-dashed border-[#9C3725] p-2 text-xs text-[#9C3725] duration-200 hover:bg-[#9C3725]/10">
                            <img
                                src="/assets/icons/red-plus-icon.svg"
                                alt="red plus icon"
                            />
                            Input Expense
                        </button>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 text-xs">
                        {expenseNames.map((expense, i) => {
                            const amount = getExpenseAmount(expense.id) || 0;
                            const percentage = totalExpenses
                                ? (amount / totalExpenses) * 100
                                : 0;

                            return (
                                <div
                                    key={i}
                                    className="flex items-center justify-between gap-2"
                                >
                                    <div className="flex flex-col gap-1">
                                        <h5 className="text-xs font-medium">
                                            {expense.name}
                                        </h5>
                                        <div className="h-1 w-20 rounded-full bg-[#D9D9D9]">
                                            <div
                                                className="h-full rounded-full bg-[#51504F]/80"
                                                style={{
                                                    width: `${percentage.toFixed(0)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <p className="font-medium text-[#9C3725]">
                                        PHP {amount ? -amount : 0}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
