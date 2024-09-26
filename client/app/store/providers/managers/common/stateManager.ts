import { Dispatch } from "@reduxjs/toolkit";
import { clone, cloneDeep } from "lodash";

// Reducer function type
type ReducerFunction = (state: any) => any;

export default class StateManager<T extends Record<string, any>> {
    private data: T;
    private lastData: T;
    private dispatchFunction: Dispatch<any>;
    private reducerFunction: ReducerFunction;
    private listeners: Record<string, () => void>;

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
        let result: any = this.data;

        keys.forEach((k) => {
            if (result && typeof result === "object") {
                result = result[k];
            }
        });

        // Return a shallow copy if the result is an object, otherwise return the value directly
        return result;
    }

    // Method to set a value at a specified key path
    set<K extends string>(key: K, value: any): this {
        const keys = key.split(".");
        let clone = cloneDeep(this.data);
        let obj: any = clone;

        // Traverse to the second-to-last key
        keys.forEach((k, i) => {
            if (i === keys.length - 1) return;
            if (!obj[k] || typeof obj[k] !== "object") {
                obj[k] = {};
            }
            obj = obj[k];
        });

        // Set the value at the last key
        obj[keys[keys.length - 1]] = value;
        this.data = clone;
        return this;
    }

    // Method to check if a property exists and call a callback if provided
    update(key: string, callback: (value: any) => void): this {
        // Retrieve the value using the `get` method
        const value = this.get(key);

        // If the value exists and a callback is provided, call the callback with the value
        if (value && callback) {
            const newValue = callback(value);
            if (newValue !== undefined) {
                this.set(key, newValue);
            }
        }

        // Return true if the value exists, otherwise false
        return this;
    }

    // Method to check if a property exists and call a callback if provided
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

    increment<K extends keyof T>(key: K, amount: number = 1): this {
        if (typeof this.data[key] === "number") {
            this.data[key] = ((this.data[key] as unknown as number) +
                amount) as T[K];
        }
        return this;
    }

    decrement<K extends keyof T>(key: K, amount: number = 1): this {
        if (typeof this.data[key] === "number") {
            this.data[key] = ((this.data[key] as unknown as number) -
                amount) as T[K];
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

    // Combined method to remove an item from an array or delete a key from an object
    remove<K extends keyof T>(
        key: K,
        objectKeyOrIndex?: string | number
    ): this {
        const target = this.data[key];

        if (objectKeyOrIndex === undefined) {
            if (Array.isArray(target)) {
                target.pop();
            }
        } else if (
            typeof objectKeyOrIndex === "string" &&
            typeof target === "object" &&
            target !== null
        ) {
            delete target[objectKeyOrIndex];
        } else if (
            typeof objectKeyOrIndex === "number" &&
            Array.isArray(target)
        ) {
            const index = objectKeyOrIndex as number;
            if (index >= 0 && index < target.length) {
                target.splice(index, 1);
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

    listen<K extends keyof T>(field: K, callback: () => void): this {
        this.listeners[field as string] = callback;
        return this;
    }

    reset(initialState?: T): this {
        this.data = initialState ? { ...initialState } : { ...this.lastData };
        return this;
    }

    save(): void {
        const updatedFields: Partial<T> = {};

        for (const key in this.data) {
            if (
                this.data.hasOwnProperty(key) &&
                this.data[key] !== this.lastData[key]
            ) {
                updatedFields[key as keyof T] = this.data[key];
                if (this.listeners[key]) {
                    this.listeners[key]();
                }
            }
        }

        if (Object.keys(updatedFields).length > 0) {
            this.lastData = cloneDeep(this.data);
            this.dispatchFunction(this.reducerFunction({ ...updatedFields }));
        }
    }
}
