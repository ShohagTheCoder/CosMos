import { KeyboardEvent } from "react";

// eslint-disable-next-line no-unused-vars
type KeyEventCallback = (e: KeyboardEvent) => void;

export default class KeyboardHandler {
    private keyListeners: { [code: string]: KeyEventCallback[] } = {};
    private groupKeyListeners: { [code: string]: KeyEventCallback[] } = {};
    private longPressListeners: { [code: string]: KeyEventCallback[] } = {};
    private longPressTimers: { [code: string]: NodeJS.Timeout } = {};
    private longPressDuration = 500; // Default long press duration (in milliseconds)
    private activeKeys: Set<string> = new Set();
    private longPressTriggered: Set<string> = new Set(); // Track keys that triggered a long press
    private groupPressedTriggered: Set<string> = new Set(); // Track group keys that triggered

    // List of keys that can be continuously pressed without being released
    private continuableKeys: Set<string> = new Set(["Backspace", "Space"]);

    // List of keys for which to prevent default actions
    private preventDefaultKeys: Set<string> = new Set();
    public params: any = {};

    public value: string = ""; // Store the current input value

    // New callbacks to handle common key up and key down events
    private keyDownCommonCallback?: KeyEventCallback;
    private keyUpCommonCallback?: KeyEventCallback;

    constructor() {}

    // Set common key down callback
    public setKeyDownCommonCallback(callback: KeyEventCallback) {
        this.keyDownCommonCallback = callback;
    }

    // Set common key up callback
    public setKeyUpCommonCallback(callback: KeyEventCallback) {
        this.keyUpCommonCallback = callback;
    }

    // Method to add a new continuable key from outside
    public addContinuableKey(code: string) {
        this.continuableKeys.add(code);
    }

    // Listen for a single code or an array of codes
    public listen(codes: string | string[], callback: KeyEventCallback) {
        const codeArray = Array.isArray(codes) ? codes : [codes];
        codeArray.forEach((code) => {
            if (!this.keyListeners[code]) {
                this.keyListeners[code] = [];
            }
            this.keyListeners[code].push(callback);
        });
        return this;
    }

    // Group pressed codes
    public group(codes: string[], callback: KeyEventCallback) {
        const groupKey = codes.sort().join("+");
        if (!this.groupKeyListeners[groupKey]) {
            this.groupKeyListeners[groupKey] = [];
        }
        this.groupKeyListeners[groupKey].push(callback);
        return this;
    }

    // Long press support with dynamic duration
    public longPress(
        codes: string | string[], // Accept a single code or an array of codes
        callback: KeyEventCallback,
        duration: number = this.longPressDuration
    ) {
        const codeArray = Array.isArray(codes) ? codes : [codes];
        codeArray.forEach((code) => {
            if (!this.longPressListeners[code]) {
                this.longPressListeners[code] = [];
            }
            this.longPressListeners[code].push(callback);
        });
        this.longPressDuration = duration; // Store the duration for each listener
        return this;
    }

    // Set keys to prevent default actions
    public setPreventDefaultKeys(keys: string[]) {
        this.preventDefaultKeys = new Set(keys);
    }

    // Handle key down event
    public handleKeyDown(e: KeyboardEvent) {
        const code = e.code;
        const inputElement = e.target as HTMLInputElement;
        this.value = inputElement.value;

        // Prevent default behavior for non-continuable codes
        if (!this.continuableKeys.has(code) && this.activeKeys.has(code)) {
            e.preventDefault(); // Prevent default action for non-continuable codes
            return; // Skip further processing for this code
        }

        // Prevent default behavior for specified keys
        if (this.preventDefaultKeys.has(code)) {
            e.preventDefault(); // Prevent default action for specified keys
        }

        this.activeKeys.add(code); // Add the code to active keys

        // Start long press detection
        this.handleLongPressStart(e);

        // After handling individual code press, check for group presses
        this.handleGroupPress(e);

        // Call the common key down callback if provided
        if (this.keyDownCommonCallback && !e.defaultPrevented) {
            this.keyDownCommonCallback(e);
        }
    }

    public isPrintableKey(e: KeyboardEvent): boolean {
        // Check if the key is a single character (which indicates it's printable)
        return e.key.length === 1 && !e.ctrlKey && !e.metaKey;
    }

    // Handle key up event
    public handleKeyUp(e: KeyboardEvent) {
        const code = e.code;

        // Clear any active long press timers and reset state
        if (this.longPressTimers[code]) {
            clearTimeout(this.longPressTimers[code]);
            delete this.longPressTimers[code];
        }

        // Remove the code from active keys and reset long press flags
        this.activeKeys.delete(code);

        // Check if the code triggered a long press
        if (this.longPressTriggered.has(code)) {
            this.longPressTriggered.delete(code); // Clear the long press trigger on code release
            return;
        }

        if (this.groupPressedTriggered.has(code)) {
            this.groupPressedTriggered.delete(code); // Clear the group trigger on code release
            return;
        }

        this.handleKeyPress(e, this.keyListeners);
        // Call the common key up callback if provided and not prevented
        if (this.keyUpCommonCallback && !e.defaultPrevented) {
            this.keyUpCommonCallback(e);
        }
    }

    // Start a timer for long press detection
    private handleLongPressStart(e: KeyboardEvent) {
        const code = e.code;
        const listeners = this.longPressListeners[code];
        if (listeners && !this.longPressTriggered.has(code)) {
            // Prevent multiple triggers without code up
            this.longPressTimers[code] = setTimeout(() => {
                this.longPressTriggered.add(code); // Mark this code as having triggered a long press
                e.preventDefault(); // Prevent default action for long press
                listeners.forEach((callback) => callback(e)); // Call each registered long press callback
            }, this.longPressDuration);
        }
    }

    // Handle group pressed codes
    private handleGroupPress(e: KeyboardEvent) {
        const pressedCodes = Array.from(this.activeKeys).sort().join("+");
        if (this.groupKeyListeners[pressedCodes]) {
            e.preventDefault();
            this.activeKeys.forEach((code) => {
                this.groupPressedTriggered.add(code); // Mark group code as triggered
            });
            this.groupKeyListeners[pressedCodes].forEach(
                (callback) => callback(e) // Call each registered group code callback
            );
        }
    }

    // Handle individual code press events
    private handleKeyPress(
        e: KeyboardEvent,
        listeners: { [code: string]: KeyEventCallback[] }
    ) {
        const code = e.code;
        // Skip calling regular listeners if the long press was triggered for this code
        if (this.longPressTriggered.has(code)) return;

        if (listeners[code]) {
            listeners[code].forEach((callback) => callback(e)); // Call each registered code callback
        }
    }

    // Clear all listeners and reset state
    public clearListeners() {
        this.keyListeners = {};
        this.groupKeyListeners = {};
        this.longPressListeners = {};
        this.activeKeys.clear();
        this.longPressTriggered.clear();
        this.groupPressedTriggered.clear(); // Clear group pressed tracking
    }
}
