import React, { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";

interface DatePaginationProps {
    startDate: Date;
    endDate: Date;
    onDateChange: (newStartDate: Date, newEndDate: Date) => void;
}

const DatePagination: React.FC<DatePaginationProps> = ({
    startDate,
    endDate,
    onDateChange,
}) => {
    const [showCalendar, setShowCalendar] = useState(false);

    const handleDateChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "start" | "end"
    ) => {
        const newDate = new Date(e.target.value);
        if (type === "start") {
            onDateChange(newDate, endDate);
        } else {
            onDateChange(startDate, newDate);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 space-y-4 bg-gray-800 rounded-lg shadow-lg">
            {/* Date Range Selector */}
            <div className="flex items-center justify-center gap-4">
                {/* Start Date Picker */}
                <div className="flex flex-col items-center">
                    <label className="text-gray-300 mb-1">Start Date</label>
                    <input
                        type="date"
                        value={format(startDate, "yyyy-MM-dd")}
                        onChange={(e) => handleDateChange(e, "start")}
                        className="px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded-md"
                    />
                </div>

                {/* End Date Picker */}
                <div className="flex flex-col items-center">
                    <label className="text-gray-300 mb-1">End Date</label>
                    <input
                        type="date"
                        value={format(endDate, "yyyy-MM-dd")}
                        onChange={(e) => handleDateChange(e, "end")}
                        className="px-3 py-2 bg-gray-900 text-white border border-gray-600 rounded-md"
                    />
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-center gap-4">
                {/* Previous Date Button */}
                <button
                    onClick={() =>
                        onDateChange(subDays(startDate, 1), subDays(endDate, 1))
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                    <FaArrowLeft />
                    Previous Day
                </button>

                {/* Display Current Date Range */}
                <div className="relative">
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="px-4 py-2 text-lg font-semibold bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 flex items-center gap-2"
                    >
                        <FaCalendarAlt />
                        {format(startDate, "MMMM dd, yyyy")} -{" "}
                        {format(endDate, "MMMM dd, yyyy")}
                    </button>
                </div>

                {/* Next Date Button */}
                <button
                    onClick={() =>
                        onDateChange(addDays(startDate, 1), addDays(endDate, 1))
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                    Next Day
                    <FaArrowRight />
                </button>
            </div>
        </div>
    );
};

export default DatePagination;
