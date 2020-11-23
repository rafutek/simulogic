import { registerDecorator, ValidationOptions, ValidationArguments, isNotEmpty } from "class-validator";

/**
 * Registers a decorator on a boolean variable to check if another variable is defined.
 * If decorated variable is true, dependent variable must be defined.
 * If not, an exception will be thrown.
 * @param property name of the variable to check
 * @param validationOptions optional object to set validation options
 */
export const DependsOnIfTrue = (property: string, validationOptions?: ValidationOptions) => {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            name: "DependsOnIfTrue",
            target: object.constructor,
            propertyName: propertyName,
            constraints: [property],
            options: validationOptions,
            validator: {
                validate(value: boolean, args: ValidationArguments) {
                    const [relatedPropertyName] = args.constraints;
                    const relatedValue = (args.object as any)[relatedPropertyName];
                    if (value) {
                        return isNotEmpty(relatedValue);
                    } else return true;
                }
            }
        });
    };
}