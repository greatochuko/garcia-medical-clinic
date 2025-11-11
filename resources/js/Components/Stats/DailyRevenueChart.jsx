import React, { useEffect, useRef, useState } from "react";

export default function DailyRevenueChart({
    data = [],
    height = 80,
    color = "#089BAB",
    strokeWidth = 1,
    pointSize = 2,
    padding = 10,
}) {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const svgRef = useRef(null);
    const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (svgRef.current) {
            const rect = svgRef.current.getBoundingClientRect();
            setSvgSize({ width: rect.width, height: rect.height });
        }
    }, []);

    if (!data.length) return null;

    const virtualWidth = 300;
    const chartHeight = height - padding * 2;
    const chartWidth = virtualWidth - padding * 2;

    const max = Math.max(...data.map((d) => d.value));
    const min = Math.min(...data.map((d) => d.value));

    const scaleY = (value) =>
        max === min
            ? height / 2
            : padding +
              chartHeight -
              ((value - min) / (max - min)) * chartHeight;

    const coords = data.map(({ label, value }, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = scaleY(value);
        return { x, y, label, value };
    });

    const points = coords.map((c) => `${c.x},${c.y}`).join(" ");

    const getTooltipPosition = (point) => {
        if (!svgSize.width || !svgSize.height) return { left: 0, top: 0 };
        const scaleX = svgSize.width / virtualWidth;
        const scaleY = svgSize.height / height;
        return { left: point.x * scaleX, top: point.y * scaleY - 40 };
    };

    return (
        <div className="relative aspect-[3/1] w-full">
            <svg
                ref={svgRef}
                className="w-full"
                viewBox={`0 0 ${virtualWidth} ${height}`}
                preserveAspectRatio="none"
            >
                <defs>
                    <filter
                        id="lineShadow"
                        x="-50%"
                        y="-50%"
                        width="200%"
                        height="200%"
                    >
                        <feDropShadow
                            dx="0"
                            dy="4"
                            stdDeviation="3"
                            floodColor={color}
                        />
                    </filter>
                </defs>

                <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#lineShadow)"
                />

                {coords.map((c, idx) => (
                    <circle
                        key={idx}
                        cx={c.x}
                        cy={c.y}
                        r={pointSize}
                        fill={color}
                        stroke="#fff"
                        strokeWidth="1"
                        onMouseEnter={() => setHoveredPoint(c)}
                        onMouseLeave={() => setHoveredPoint(null)}
                        className="cursor-pointer"
                    />
                ))}
            </svg>

            {/* Tooltip */}
            {hoveredPoint && (
                <span
                    className="absolute flex items-center gap-1.5 whitespace-nowrap rounded bg-[#1B1B1B]/90 p-2 text-xs text-white shadow"
                    style={{
                        ...getTooltipPosition(hoveredPoint),
                        transform: "translateX(-50%)",
                        pointerEvents: "none",
                    }}
                >
                    <span className="h-2 w-2 rounded-full bg-[#089BAB]" />
                    {hoveredPoint.label}: PHP {hoveredPoint.value}
                </span>
            )}

            <div className="mt-2 flex justify-between">
                {coords.map((c, idx) => (
                    <span key={idx} className="text-[10px]">
                        {c.label}
                    </span>
                ))}
            </div>
        </div>
    );
}
