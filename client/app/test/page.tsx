"use client";
import React, { KeyboardEvent, useRef } from "react";
import CommandHandler from "../common/handlers/commandHandler";

export default function KeyboardInput() {
    const commandHandler = useRef(new CommandHandler()).current;

    return (
        <div className="h-screen flex justify-center items-center">
            <input
                type="text"
                className="py-2 px-3 bg-slate-700 outline-none"
                onKeyDown={(e: KeyboardEvent) =>
                    commandHandler.handleKeyDown(e)
                }
                onKeyUp={(e: KeyboardEvent) => commandHandler.handleKeyUp(e)}
                placeholder="Type here..."
            />
        </div>
    );
}
