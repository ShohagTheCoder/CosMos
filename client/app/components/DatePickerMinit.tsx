import React, { useState } from "react";
import { format, addDays, subDays } from "date-fns";
import {
    FaCalendarAlt,
    FaArrowLeft,
    FaArrowRight,
    FaTimes,
} from "react-icons/fa";

interface DateInputProps {
    startDate: Date;
    endDate: Date;
    onDateChange: (newStartDate: Date, newEndDate: Date) => void;
}

const DatePickerMini: React.FC<DateInputProps> = ({
    startDate,
    endDate,
    onDateChange,
}) => {
    const [showCalendar, setShowCalendar] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        isStart: boolean
    ) => {
        const newDate = new Date(e.target.value);
        isStart
            ? onDateChange(newDate, endDate)
            : onDateChange(startDate, newDate);
    };

    return (
        <div className="relative flex items-center">
            <button
                onClick={() =>
                    onDateChange(subDays(startDate, 1), subDays(endDate, 1))
                }
                className="bg-gray-700 text-white p-2 rounded-md mr-2"
            >
                <FaArrowLeft />
            </button>

            <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="flex items-center bg-gray-800 text-gray-300 p-2 rounded-md"
            >
                <FaCalendarAlt className="mr-2" />
                {`${format(startDate, "MMMM dd, yyyy")} - ${format(
                    endDate,
                    "MMMM dd, yyyy"
                )}`}
            </button>

            <button
                onClick={() =>
                    onDateChange(addDays(startDate, 1), addDays(endDate, 1))
                }
                className="bg-gray-700 text-white p-2 rounded-md ml-2"
            >
                <FaArrowRight />
            </button>

            {showCalendar && (
                <div className="absolute bg-gray-900 p-4 rounded-md shadow-lg mt-2">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300">Select Dates</span>
                        <button
                            onClick={() => setShowCalendar(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    <div className="flex gap-4">
                        <div>
                            <label className="text-gray-300">Start Date</label>
                            <input
                                type="date"
                                value={format(startDate, "yyyy-MM-dd")}
                                onChange={(e) => handleChange(e, true)}
                                className="block mt-1 px-2 py-1 rounded-md bg-gray-800 text-white border border-gray-600"
                            />
                        </div>
                        <div>
                            <label className="text-gray-300">End Date</label>
                            <input
                                type="date"
                                value={format(endDate, "yyyy-MM-dd")}
                                onChange={(e) => handleChange(e, false)}
                                className="block mt-1 px-2 py-1 rounded-md bg-gray-800 text-white border border-gray-600"
                            />
                        </div>
                    </div>
                    <div className="mt-4 flex justify-between">
                        <button
                            onClick={() =>
                                onDateChange(
                                    subDays(startDate, 1),
                                    subDays(endDate, 1)
                                )
                            }
                            className="bg-gray-700 text-white p-2 rounded-md"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() =>
                                onDateChange(
                                    addDays(startDate, 1),
                                    addDays(endDate, 1)
                                )
                            }
                            className="bg-gray-700 text-white p-2 rounded-md"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePickerMini;
