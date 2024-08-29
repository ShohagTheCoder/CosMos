import React from "react";

interface PieChartProps {
    data: { label: string; value: number }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
    const totalValue = data.reduce((acc, item) => acc + item.value, 0);
    let cumulativeValue = 0;

    const slices = data.map((item, index) => {
        const startAngle = (cumulativeValue / totalValue) * 360;
        cumulativeValue += item.value;
        const endAngle = (cumulativeValue / totalValue) * 360;

        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

        const startX = 50 + 50 * Math.cos((Math.PI * startAngle) / 180);
        const startY = 50 + 50 * Math.sin((Math.PI * startAngle) / 180);
        const endX = 50 + 50 * Math.cos((Math.PI * endAngle) / 180);
        const endY = 50 + 50 * Math.sin((Math.PI * endAngle) / 180);

        const pathData = `M50,50 L${startX},${startY} A50,50 0 ${largeArcFlag} 1 ${endX},${endY} Z`;

        return (
            <path
                key={index}
                d={pathData}
                fill={`hsl(${(index / data.length) * 360}, 70%, 50%)`}
            />
        );
    });

    return (
        <div className="w-full max-w-xl mx-auto">
            <svg viewBox="0 0 100 100" className="w-full h-48">
                {slices}
            </svg>
        </div>
    );
};

export default PieChart;
