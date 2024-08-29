import React from "react";

interface LineChartProps {
    data: { label: string; value: number }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => d.value));
    const points = data
        .map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div className="w-full max-w-xl mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-48">
                <polyline
                    fill="none"
                    stroke="blue"
                    strokeWidth="1.5"
                    points={points}
                />
                {data.map((item, index) => {
                    const x = (index / (data.length - 1)) * 100;
                    const y = 100 - (item.value / maxValue) * 100;
                    return (
                        <circle key={index} cx={x} cy={y} r="1.5" fill="blue" />
                    );
                })}
            </svg>
        </div>
    );
};

export default LineChart;
