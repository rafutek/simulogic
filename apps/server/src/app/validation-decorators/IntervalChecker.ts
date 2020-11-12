import { registerDecorator, ValidationOptions, ValidationArguments, isNotEmpty, isEmpty } from "class-validator";
import { Interval } from '@simulogic/core';

/**
 * Registers a decorator used to check interval variable.
 * Registered decorator will throw an exception if variable is an invalid interval.
 * @param validationOptions optional object to set validation options
 */
export const IntervalChecker = (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: "IntervalChecker",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: validateInterval
        });
    };
}

/**
 * Returns true if value is a valid interval.
 * @param value valid or invalid interval variable
 */
export const validateInterval = (value: any): boolean => {
    console.log("test")
    const interval = value as Interval;
    if (isEmpty(interval?.start) && isEmpty(interval?.end)) {
        return false;
    }
    if (isNotEmpty(interval?.start) && typeof interval.start != "number") {
        return false;
    }
    if (isNotEmpty(interval?.end) && typeof interval.end != "number") {
        return false;
    }
    if (isNotEmpty(interval?.start) && isNotEmpty(interval?.end) &&
        interval.start >= interval.end) {
        return false;
    }
    return true;
}