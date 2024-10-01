import { KeyboardEvent } from "react";

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

    private continuableKeys: Set<string> = new Set(["Backspace", "Space"]);
    private preventDefaultKeys: Set<string> = new Set();
    public params: any = {};
    public value: string = ""; // Store the current input value

    private keyDownCommonCallback?: KeyEventCallback;
    private keyUpCommonCallback?: KeyEventCallback;

    constructor() {
        window.addEventListener("focus", this.resetActiveKeys.bind(this));
    }

    public setKeyDownCommonCallback(callback: KeyEventCallback) {
        this.keyDownCommonCallback = callback;
    }

    public setKeyUpCommonCallback(callback: KeyEventCallback) {
        this.keyUpCommonCallback = callback;
    }

    public addContinuableKey(code: string) {
        this.continuableKeys.add(code);
    }

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

    public group(codes: string[], callback: KeyEventCallback) {
        const groupKey = codes.sort().join("+");
        if (!this.groupKeyListeners[groupKey]) {
            this.groupKeyListeners[groupKey] = [];
        }
        this.groupKeyListeners[groupKey].push(callback);
        return this;
    }

    public longPress(
        codes: string | string[],
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
        this.longPressDuration = duration;
        return this;
    }

    public setPreventDefaultKeys(keys: string[]) {
        this.preventDefaultKeys = new Set(keys);
    }

    public handleKeyDown(e: KeyboardEvent) {
        const code = e.code;
        const inputElement = e.target as HTMLInputElement;
        this.value = inputElement.value;

        if (!this.continuableKeys.has(code) && this.activeKeys.has(code)) {
            e.preventDefault();
            return;
        }

        if (this.preventDefaultKeys.has(code)) {
            e.preventDefault();
        }

        this.activeKeys.add(code);

        this.handleLongPressStart(e);

        this.handleGroupPress(e);

        if (this.keyDownCommonCallback && !e.defaultPrevented) {
            this.keyDownCommonCallback(e);
        }
    }

    public isPrintableKey(e: KeyboardEvent): boolean {
        return e.key.length === 1 && !e.ctrlKey && !e.metaKey;
    }

    public handleKeyUp(e: KeyboardEvent) {
        const code = e.code;

        if (this.longPressTimers[code]) {
            clearTimeout(this.longPressTimers[code]);
            delete this.longPressTimers[code];
        }

        this.activeKeys.delete(code);

        if (this.longPressTriggered.has(code)) {
            this.longPressTriggered.delete(code);
            return;
        }

        if (this.groupPressedTriggered.has(code)) {
            this.groupPressedTriggered.delete(code);
            return;
        }

        this.handleKeyPress(e, this.keyListeners);
        if (this.keyUpCommonCallback && !e.defaultPrevented) {
            this.keyUpCommonCallback(e);
        }
    }

    private handleLongPressStart(e: KeyboardEvent) {
        const code = e.code;
        const listeners = this.longPressListeners[code];
        if (listeners && !this.longPressTriggered.has(code)) {
            this.longPressTimers[code] = setTimeout(() => {
                this.longPressTriggered.add(code);
                e.preventDefault();
                listeners.forEach((callback) => callback(e));
            }, this.longPressDuration);
        }
    }

    private handleGroupPress(e: KeyboardEvent) {
        const pressedCodes = Array.from(this.activeKeys).sort().join("+");
        if (this.groupKeyListeners[pressedCodes]) {
            e.preventDefault();
            this.activeKeys.forEach((code) => {
                this.groupPressedTriggered.add(code);
            });
            this.groupKeyListeners[pressedCodes].forEach((callback) =>
                callback(e)
            );
        }
    }

    private handleKeyPress(
        e: KeyboardEvent,
        listeners: { [code: string]: KeyEventCallback[] }
    ) {
        const code = e.code;

        if (this.longPressTriggered.has(code)) return;

        if (listeners[code]) {
            listeners[code].forEach((callback) => callback(e));
        }
    }

    private resetActiveKeys = () => {
        this.activeKeys.clear(); // Clear active keys to reset group press detection
        this.groupPressedTriggered.clear(); // Clear group pressed state
    };

    public clearListeners() {
        this.keyListeners = {};
        this.groupKeyListeners = {};
        this.longPressListeners = {};
        this.activeKeys.clear();
        this.longPressTriggered.clear();
        this.groupPressedTriggered.clear();
    }

    public destroy() {
        window.removeEventListener("focus", this.resetActiveKeys);
    }
}
