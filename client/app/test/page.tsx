"use client";
import React, { useRef, useState } from "react";
import sortDraggedItems from "../functions/sortDraggedItems";

const ExamplePage: React.FC = () => {
    const [people, setPeople] = useState([
        {
            id: 1,
            name: "Shohag Ahmed",
        },
        {
            id: 2,
            name: "Foysal Ahmed",
        },
        {
            id: 3,
            name: "Imran Ahmed",
        },
        {
            id: 4,
            name: "Abdullah Ahmed",
        },
    ]);

    const dragPerson = useRef<number>(0);
    const draggedOverPerson = useRef<number>(0);

    function handleSort() {
        setPeople(
            sortDraggedItems(
                people,
                dragPerson.current,
                draggedOverPerson.current
            )
        );
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <div>
                {people.map((item, index) => (
                    <div
                        key={index}
                        className="py-2 px-3 bg-gray-700 mb-3 rounded-md flex items-center justify-between"
                        onDragEnter={() => (draggedOverPerson.current = index)}
                        onDragOver={(e) => e.preventDefault()} // To allow dropping
                        onDrop={handleSort} // Handle sort on drop
                    >
                        <p className="text-white">
                            {item.id} : {item.name}
                        </p>
                        {/* Drag handle */}
                        <button
                            className="cursor-grab bg-gray-500 hover:bg-gray-600 p-2 rounded-md text-white ml-3"
                            draggable
                            onDragStart={() => (dragPerson.current = index)}
                        >
                            Drag
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExamplePage;
