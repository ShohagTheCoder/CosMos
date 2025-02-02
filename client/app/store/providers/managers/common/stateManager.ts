import { Dispatch } from "@reduxjs/toolkit";
import { clone, cloneDeep, isEqual } from "lodash";

// Reducer function type
// eslint-disable-next-line no-unused-vars
type ReducerFunction = (state: any) => any;

export default class StateManager<T extends Record<string, any>> {
    private data: T;
    private lastData: T;
    private dispatchFunction: Dispatch<any>;
    private reducerFunction: ReducerFunction;
    // eslint-disable-next-line no-unused-vars
    private listeners: Record<string, (id?: string) => void>;

    constructor(
        initialState: T,
        dispatchFunction: Dispatch<any>,
        reducerFunction: ReducerFunction
    ) {
        this.data = cloneDeep(initialState);
        this.lastData = cloneDeep(initialState);
        this.dispatchFunction = dispatchFunction;
        this.reducerFunction = reducerFunction;
        this.listeners = {}; // Initialize listeners
    }

    // Universal method to get any state key or the whole state
    get(key: string): any {
        const keys = key.split(".");
        let result: any = cloneDeep(this.data);

        // Handle dynamic key replacements and traverse through the object
        for (const k of keys) {
            if (k.startsWith("{{") && k.endsWith("}}")) {
                const dynamicKeyName = k.slice(2, -2); // Extract key name between `{{}}`
                const dynamicKey = this.data[dynamicKeyName];

                if (
                    result &&
                    typeof result === "object" &&
                    dynamicKey in result
                ) {
                    result = result[dynamicKey];
                } else {
                    return undefined;
                }
            } else {
                if (result && typeof result === "object" && k in result) {
                    result = result[k];
                } else {
                    return undefined;
                }
            }
        }

        // Return a shallow copy if result is an object, otherwise return the value directly
        return typeof result === "object" ? { ...result } : result;
    }

    set<K extends string>(key: K, value: any): this {
        const keys = key.split(".");
        let clone = cloneDeep(this.data); // Clone the original data
        let obj: any = clone; // Reference for traversal

        // Resolve dynamic keys before starting the loop
        const resolvedKeys = keys.map((k) => {
            if (k.startsWith("{{") && k.endsWith("}}")) {
                const dynamicKeyName = k.slice(2, -2); // Extract dynamic key placeholder
                return this.data[dynamicKeyName] ?? k; // Resolve dynamic key or use the placeholder if undefined
            }
            return k;
        });

        // Traverse to the second-to-last key using resolved keys
        for (let i = 0; i < resolvedKeys.length - 1; i++) {
            const k = resolvedKeys[i];

            // Ensure the key path is initialized correctly without duplication
            if (!(k in obj) || typeof obj[k] !== "object") {
                obj[k] = {}; // Initialize only if not an object
            }
            obj = obj[k]; // Move to the next level in the object hierarchy
        }

        // Set the value at the last key using the resolved key path
        const finalKey = resolvedKeys[resolvedKeys.length - 1];
        obj[finalKey] = value;

        // Update the main data structure
        this.data = clone;

        return this;
    }

    getData() {
        return cloneDeep(this.data);
    }

    // Method to check if a property exists and call a callback if provided
    // eslint-disable-next-line no-unused-vars
    update(key: string, callback: (value: any) => void): this {
        // Retrieve the value using the `get` method
        const value = this.get(key);

        // If the value exists and a callback is provided, call the callback with the value
        if (value !== undefined && value !== null && callback) {
            const newValue = callback(cloneDeep(value));
            if (newValue != undefined) {
                this.set(key, newValue);
            }
        }

        // Return true if the value exists, otherwise false
        return this;
    }

    // Method to check if a property exists and call a callback if provided
    // eslint-disable-next-line no-unused-vars
    has(key: string, callback?: (value: any) => void): boolean {
        // Retrieve the value using the `get` method
        const value = this.get(key);

        // Determine if the value is not `undefined` or `null`
        const exists = value !== undefined && value !== null;

        // If the value exists and a callback is provided, call the callback with the value
        if (exists && callback) {
            const newValue = callback(clone(value));
            if (newValue !== undefined) {
                this.set(key, newValue);
            }
        }

        // Return true if the value exists, otherwise false
        return exists;
    }

    increment<K extends string>(key: K, amount: number = 1): this {
        let value = this.get(key);

        if (value != undefined) {
            this.set(key, value + amount);
        }
        return this;
    }

    decrement<K extends string>(key: K, amount: number = 1): this {
        let value = this.get(key);
        if (value != undefined) {
            this.set(key, value - amount);
        }
        return this;
    }

    // Universal method to delete any state key
    delete<K extends keyof T>(key: K): this {
        delete this.data[key];
        return this;
    }

    // Combined method to add an item to an array or a key-value pair to an object
    add<K extends keyof T>(
        key: K,
        value: any,
        objectKeyOrIndex?: string | number
    ): this {
        const target = this.data[key];

        if (objectKeyOrIndex === undefined) {
            if (Array.isArray(target)) {
                target.push(value);
            }
        } else if (
            typeof objectKeyOrIndex === "string" &&
            typeof target === "object" &&
            target !== null
        ) {
            target[objectKeyOrIndex] = value;
        } else if (
            typeof objectKeyOrIndex === "number" &&
            Array.isArray(target)
        ) {
            target.splice(objectKeyOrIndex, 0, value);
        }

        return this;
    }

    remove<K extends keyof T>(
        key: K,
        objectKeyOrIndex?: string | number
    ): this {
        const target = this.data[key];

        if (target === undefined || target === null) {
            // Early return if the target is undefined or null
            return this;
        }

        if (objectKeyOrIndex === undefined) {
            if (Array.isArray(target)) {
                // Clone the array, remove the last item, and update data
                let newArray = [...target];
                newArray.pop();
                let data = cloneDeep(this.data);
                data[key] = newArray as T[K];
                this.data = data;
            }
        } else if (
            typeof objectKeyOrIndex === "string" &&
            typeof target === "object" &&
            !Array.isArray(target)
        ) {
            // Object case (removing a property)
            const { [objectKeyOrIndex]: _, ...rest } = target;
            let data = cloneDeep(this.data);
            data[key] = rest as T[K];
            this.data = data;
        } else if (
            typeof objectKeyOrIndex === "number" &&
            Array.isArray(target)
        ) {
            const index = objectKeyOrIndex;
            if (index >= 0 && index < target.length) {
                // Clone the array, remove the item at the given index, and update data
                let newArray = [...target];
                newArray.splice(index, 1);
                let data = cloneDeep(this.data);
                data[key] = newArray as T[K];
                this.data = data;
            }
        }

        return this;
    }

    keys<K extends keyof T>(key: K): string[] {
        return this.data[key] && typeof this.data[key] === "object"
            ? Object.keys(this.data[key] as object)
            : [];
    }

    values<K extends keyof T>(key: K): any[] {
        return this.data[key] && typeof this.data[key] === "object"
            ? Object.values(this.data[key] as object)
            : [];
    }

    entries<K extends keyof T>(key: K): [string, any][] {
        return this.data[key] && typeof this.data[key] === "object"
            ? Object.entries(this.data[key] as object)
            : [];
    }

    toggle<K extends keyof T>(key: K): this {
        if (typeof this.data[key] === "boolean") {
            this.data[key] = !this.data[key] as T[K];
        }
        return this;
    }

    merge<K extends keyof T>(key: K, value: Partial<T[K]>): this {
        if (this.data[key] && typeof this.data[key] === "object") {
            this.data[key] = { ...this.data[key], ...value };
        }
        return this;
    }

    // eslint-disable-next-line no-unused-vars
    listen<K extends string>(field: K, callback: (id?: any) => void): this {
        this.listeners[field as string] = callback;
        return this;
    }

    reset(initialState: T): void {
        this.data = initialState;
        this.lastData = initialState;
        this.dispatchFunction(this.reducerFunction(initialState));
    }

    save(): void {
        let hasChanges = false;

        // First iteration: Identify changes and trigger listeners
        for (const key in this.data) {
            if (this.data.hasOwnProperty(key)) {
                const currentValue = this.data[key];
                const lastValue = this.lastData[key];

                // Check if the value has changed
                if (currentValue !== lastValue) {
                    // If it's an object, check deep equality
                    if (
                        typeof currentValue === "object" &&
                        isEqual(currentValue, lastValue)
                    ) {
                        continue; // Skip if they are deeply equal
                    }

                    // Run wildcard listeners like `products.[?]` if defined
                    const wildcardPath = `${key}.[?]`;
                    if (
                        this.listeners[wildcardPath] &&
                        typeof currentValue === "object"
                    ) {
                        for (const subKey in currentValue) {
                            if (currentValue[subKey] !== lastValue?.[subKey]) {
                                this.listeners[wildcardPath](subKey);
                            }
                        }
                    }

                    // Trigger general listener for this key, if defined
                    if (this.listeners[key]) {
                        this.listeners[key]();
                    }

                    hasChanges = true; // Mark that a change has occurred
                }
            }
        }

        // Dispatch the entire state only if changes have been detected
        if (hasChanges) {
            this.lastData = { ...this.data }; // Use shallow copy instead of deep clone
            this.dispatchFunction(this.reducerFunction(this.data)); // Dispatch data directly without deep cloning
        }
    }
}
