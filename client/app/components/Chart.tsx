import React from "react";

interface ChartProps {
    data: { label: string; value: number }[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="w-full max-w-xl mx-auto">
            {data.map((item, index) => (
                <div key={index} className="mb-4">
                    <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">
                            {item.label}
                        </span>
                        <span className="text-sm font-medium text-gray-700">
                            {item.value}
                        </span>
                    </div>
                    <div className="relative h-5 w-full bg-gray-200 rounded">
                        <div
                            className="absolute top-0 left-0 h-full bg-blue-600 rounded"
                            style={{
                                width: `${(item.value / maxValue) * 100}%`,
                            }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Chart;
