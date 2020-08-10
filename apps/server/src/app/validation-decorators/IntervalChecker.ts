import { registerDecorator, ValidationOptions, ValidationArguments, isNotEmpty } from "class-validator";
import { Interval } from '@simulogic/core';

export const IntervalChecker = (validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: "IntervalChecker",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const interval = value as Interval;
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
            }
        });
    };
}