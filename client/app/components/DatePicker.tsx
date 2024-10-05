import React, { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";

interface DatePickerProps {
    startDate: Date;
    endDate: Date;
    onDateChange: (newStartDate: Date, newEndDate: Date) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
    startDate,
    endDate,
    onDateChange,
}) => {
    const [showCalendar, setShowCalendar] = useState(false);

    // Handlers for Date Changes
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newStartDate = new Date(e.target.value);
        onDateChange(newStartDate, endDate);
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEndDate = new Date(e.target.value);
        onDateChange(startDate, newEndDate);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 space-y-4 bg-gray-800 rounded-lg shadow-lg">
            {/* Date Range Selector */}
            <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center">
                    <label className="text-gray-300 mb-1">
                        Select Date Range
                    </label>
                    <button
                        onClick={() => setShowCalendar(!showCalendar)}
                        className="px-4 py-2 text-lg font-semibold bg-gray-800 text-gray-300 rounded-md hover:bg-gray-700 flex items-center gap-2"
                    >
                        <FaCalendarAlt />
                        {`${format(startDate, "MMMM dd, yyyy")} - ${format(
                            endDate,
                            "MMMM dd, yyyy"
                        )}`}
                    </button>
                </div>
            </div>

            {/* Calendar Dropdown with HTML Date Inputs */}
            {showCalendar && (
                <div className="bg-gray-900 p-4 rounded-md shadow-lg">
                    <div className="flex items-center gap-4 text-white">
                        {/* Start Date Picker */}
                        <div className="flex flex-col">
                            <label className="mb-1">Start Date</label>
                            <input
                                type="date"
                                value={format(startDate, "yyyy-MM-dd")}
                                onChange={handleStartDateChange}
                                className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
                            />
                        </div>

                        {/* End Date Picker */}
                        <div className="flex flex-col">
                            <label className="mb-1">End Date</label>
                            <input
                                type="date"
                                value={format(endDate, "yyyy-MM-dd")}
                                onChange={handleEndDateChange}
                                className="px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600"
                            />
                        </div>
                    </div>
                </div>
            )}

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

export default DatePicker;
