type KeyEventCallback = (e: KeyboardEvent) => void;

class KeyboardManager {
    private keyListeners: { [key: string]: KeyEventCallback[] } = {};
    private groupKeyListeners: { [key: string]: KeyEventCallback[] } = {};
    private longPressListeners: { [key: string]: NodeJS.Timeout } = {};
    private longPressDuration = 500; // Default long press duration (in milliseconds)
    private activeKeys: Set<string> = new Set();

    constructor() {
        this.initializeListeners();
    }

    // Listen for a single key or an array of keys
    public listen(keys: string | string[], callback?: KeyEventCallback) {
        const keyArray = Array.isArray(keys) ? keys : [keys];
        keyArray.forEach((key) => {
            if (!this.keyListeners[key]) {
                this.keyListeners[key] = [];
            }
            if (callback) {
                this.keyListeners[key].push(callback);
            }
        });
        return this;
    }

    // Group pressed keys
    public group(keys: string[], callback?: KeyEventCallback) {
        const groupKey = keys.sort().join("+");
        if (!this.groupKeyListeners[groupKey]) {
            this.groupKeyListeners[groupKey] = [];
        }
        if (callback) {
            this.groupKeyListeners[groupKey].push(callback);
        }
        return this;
    }

    // Long press support
    public longPress(key: string, duration: number = this.longPressDuration) {
        this.longPressDuration = duration;
        if (!this.longPressListeners[key]) {
            // this.longPressListeners[key] = duration;
        }
        return this;
    }

    public callback(func: KeyEventCallback) {
        Object.keys(this.longPressListeners).forEach((key) => {
            this.longPressListeners[key] = setTimeout(() => {
                func(new KeyboardEvent("longpress", { key }));
            }, this.longPressDuration);
        });
        return this;
    }

    // Prevent default action
    public preventDefault(keys: string | string[]) {
        const keyArray = Array.isArray(keys) ? keys : [keys];
        this.listen(keyArray, (e) => e.preventDefault());
        return this;
    }

    // Initialize keydown and keyup listeners
    private initializeListeners() {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
        document.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    // Handle keydown event
    private handleKeyDown(e: KeyboardEvent) {
        this.activeKeys.add(e.code);
        this.handleKeyPress(e, this.keyListeners);
        this.handleGroupPress(e);
    }

    // Handle keyup event
    private handleKeyUp(e: KeyboardEvent) {
        if (this.longPressListeners[e.code]) {
            clearTimeout(this.longPressListeners[e.code]);
        }
        this.activeKeys.delete(e.code);
    }

    // Handle individual key press events
    private handleKeyPress(
        e: KeyboardEvent,
        listeners: { [key: string]: KeyEventCallback[] }
    ) {
        if (listeners[e.code]) {
            listeners[e.code].forEach((callback) => callback(e));
        }
    }

    // Handle group pressed keys
    private handleGroupPress(e: KeyboardEvent) {
        const pressedKeys = Array.from(this.activeKeys).sort().join("+");
        if (this.groupKeyListeners[pressedKeys]) {
            this.groupKeyListeners[pressedKeys].forEach((callback) =>
                callback(e)
            );
        }
    }
}
