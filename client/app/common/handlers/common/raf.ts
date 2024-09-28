import { KeyboardEvent } from "react";

type KeyEventCallback = (e: KeyboardEvent) => void;

export class KeyboardHandler {
    private keyListeners: { [key: string]: KeyEventCallback[] } = {};
    private groupKeyListeners: { [key: string]: KeyEventCallback[] } = {};
    private longPressListeners: { [key: string]: KeyEventCallback[] } = {};
    private longPressTimers: { [key: string]: NodeJS.Timeout } = {};
    private longPressDuration = 500; // Default long press duration (in milliseconds)
    private activeKeys: Set<string> = new Set();
    private longPressTriggered: Set<string> = new Set(); // Track keys that triggered a long press

    // List of keys that can be continuously pressed without being released
    private continuableKeys: Set<string> = new Set([
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        // Add more keys as needed
    ]);

    constructor() {}

    // Method to add a new continuable key from outside
    public addContinuableKey(key: string) {
        this.continuableKeys.add(key);
    }

    // Listen for a single key or an array of keys
    public listen(keys: string | string[], callback: KeyEventCallback) {
        const keyArray = Array.isArray(keys) ? keys : [keys];
        keyArray.forEach((key) => {
            if (!this.keyListeners[key]) {
                this.keyListeners[key] = [];
            }
            this.keyListeners[key].push(callback);
        });
        return this;
    }

    // Group pressed keys
    public group(keys: string[], callback: KeyEventCallback) {
        const groupKey = keys.sort().join("+");
        if (!this.groupKeyListeners[groupKey]) {
            this.groupKeyListeners[groupKey] = [];
        }
        this.groupKeyListeners[groupKey].push(callback);
        return this;
    }

    // Long press support with dynamic duration
    public longPress(
        key: string,
        callback: KeyEventCallback,
        duration: number = this.longPressDuration
    ) {
        if (!this.longPressListeners[key]) {
            this.longPressListeners[key] = [];
        }
        this.longPressListeners[key].push(callback);
        this.longPressDuration = duration; // Store the duration for each listener
        return this;
    }

    // Handle keydown event
    public handleKeyDown(e: KeyboardEvent) {
        const key = e.key;

        // Prevent default behavior for non-continuable keys
        if (!this.continuableKeys.has(key) && this.activeKeys.has(key)) {
            e.preventDefault(); // Prevent default action for non-continuable keys
            return; // Skip further processing for this key
        }

        // Check if the key is in long press and already triggered
        if (this.longPressTriggered.has(key)) {
            e.preventDefault(); // Prevent the default action if the key is already triggered
            return; // Skip further processing for this key
        }

        this.activeKeys.add(key); // Add the key to active keys
        this.longPressTriggered.delete(key); // Reset the long press flag for the current key

        // Start long press detection
        this.handleLongPressStart(e);

        // Handle individual key press events
        this.handleKeyPress(e, this.keyListeners);

        // After handling individual key press, check for group presses
        this.handleGroupPress(e);
    }

    // Handle keyup event
    public handleKeyUp(e: KeyboardEvent) {
        const key = e.key;

        // Clear any active long press timers and reset state
        if (this.longPressTimers[key]) {
            clearTimeout(this.longPressTimers[key]);
            delete this.longPressTimers[key];
        }

        // Remove the key from active keys and reset long press flags
        this.activeKeys.delete(key);
        this.longPressTriggered.delete(key); // Clear the long press trigger on key release

        // After releasing the key, check for group presses again
        this.handleGroupPress(e); // Ensure to call this to capture released keys
    }

    // Start a timer for long press detection
    private handleLongPressStart(e: KeyboardEvent) {
        const key = e.key;
        const listeners = this.longPressListeners[key];
        if (listeners && !this.longPressTriggered.has(key)) {
            // Prevent multiple triggers without key up
            this.longPressTimers[key] = setTimeout(() => {
                this.longPressTriggered.add(key); // Mark this key as having triggered a long press
                e.preventDefault(); // Prevent default action for long press
                listeners.forEach((callback) => callback(e)); // Call each registered long press callback
            }, this.longPressDuration);
        }
    }

    // Handle group pressed keys
    private handleGroupPress(e: KeyboardEvent) {
        const pressedKeys = Array.from(this.activeKeys).sort().join("+");
        if (this.groupKeyListeners[pressedKeys]) {
            this.groupKeyListeners[pressedKeys].forEach(
                (callback) => callback(e) // Call each registered group key callback
            );
        }
    }

    // Handle individual key press events
    private handleKeyPress(
        e: KeyboardEvent,
        listeners: { [key: string]: KeyEventCallback[] }
    ) {
        const key = e.key;
        // Skip calling regular listeners if the long press was triggered for this key
        if (this.longPressTriggered.has(key)) return;

        if (listeners[key]) {
            listeners[key].forEach((callback) => callback(e)); // Call each registered key callback
        }
    }

    // Clear all listeners and reset state
    public clearListeners() {
        this.keyListeners = {};
        this.groupKeyListeners = {};
        this.longPressListeners = {};
        this.activeKeys.clear();
        this.longPressTriggered.clear();
    }
}

// Define a child class for command-specific behavior
export class CommandHandler extends KeyboardHandler {
    constructor() {
        super();
        this.setupCommands();
    }

    private setupCommands() {
        // Define specific key combinations or long press commands here
        this.listen("Enter", () => {
            console.log("Enter key pressed");
        });

        this.listen("x", () => {
            console.log("Key 'x' pressed");
        });

        this.group(["c", "x"], () => {
            console.log("Group key (c + x) pressed");
        });

        this.listen("c", () => {
            console.log("Key 'c' pressed");
        });

        this.longPress("c", () => {
            console.log("Key 'c' long-pressed");
        });
    }
}
