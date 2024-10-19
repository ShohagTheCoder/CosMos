import { useState, useCallback } from "react";

export interface ErrorsMap {
    [key: string]: string;
}

type ValidatorFunction = (value: any) => string | boolean;

export interface UseValidationHandlerReturn {
    errors: ErrorsMap;
    validate: (
        key: string,
        value: any,
        validators: ValidatorFunction[]
    ) => boolean;
    validateAll: (
        fields: { key: string; value: any; validators: ValidatorFunction[] }[]
    ) => boolean;
    setMessage: (key: string, message: string) => void;
    clear: (key?: string) => void;
    isValid: (key?: string) => boolean;
}

export default function useValidationHandler(
    fields: ErrorsMap = {}
): UseValidationHandlerReturn {
    const [errors, setErrors] = useState<ErrorsMap>(fields);

    /**
     * Validates a single field against one or more validators.
     * @param key - The field name/key.
     * @param value - The value to be validated.
     * @param validators - An array of validator functions to run.
     * @returns True if all validators pass, otherwise false.
     */
    const validate = useCallback(
        (key: string, value: any, validators: ValidatorFunction[]): boolean => {
            for (const validator of validators) {
                const validationResult = validator(value);
                if (validationResult !== true) {
                    // If a validator fails, set the error and return false
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [key]: validationResult as string,
                    }));
                    return false;
                }
            }
            // If all validators pass, remove the error for this key
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[key];
                return newErrors;
            });
            return true;
        },
        []
    );

    /**
     * Validates multiple fields at once, typically for form submission.
     * @param fields - An array of objects containing key, value, and validators for each field.
     * @returns True if all fields pass validation, otherwise false.
     */
    const validateAll = useCallback(
        (
            fields: {
                key: string;
                value: any;
                validators: ValidatorFunction[];
            }[]
        ): boolean => {
            let isFormValid = true;
            for (const { key, value, validators } of fields) {
                const isFieldValid = validate(key, value, validators);
                if (!isFieldValid) {
                    isFormValid = false;
                }
            }
            return isFormValid;
        },
        [validate]
    );

    /**
     * Sets a custom error message for a specific field.
     * @param key - The field name/key.
     * @param message - The custom error message.
     */
    const setMessage = useCallback((key: string, message: string) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [key]: message,
        }));
    }, []);

    /**
     * Clears errors. If a key is provided, clears error for that specific key.
     * Otherwise, clears all errors.
     * @param key - The field name/key to clear (optional).
     */
    const clear = useCallback((key?: string) => {
        if (key) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[key];
                return newErrors;
            });
        } else {
            setErrors({});
        }
    }, []);

    /**
     * Checks whether a specific field or the entire form is valid (i.e., no errors).
     * @param key - The field name/key to check (optional). If not provided, checks the entire form.
     * @returns True if the field/form is valid, otherwise false.
     */
    const isValid = useCallback(
        (key?: string): boolean => {
            if (key) {
                return !errors[key];
            }
            return Object.keys(errors).length === 0;
        },
        [errors]
    );

    return {
        errors,
        validate,
        validateAll,
        setMessage,
        clear,
        isValid,
    };
}
