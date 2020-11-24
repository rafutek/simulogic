import * as Joi from "joi";

/**
 * Joi object to validate loaded environment variables, or set defaults.
 */
export const validationSchema = Joi.object({
    PORT: Joi.number().default(8080),
    DB_HOST: Joi.string().default("localhost"),
    DB_PORT: Joi.number().default(3306),
    DB_NAME: Joi.string().default("test"),
    DB_USERNAME: Joi.string().default("root"),
    DB_PASSWORD: Joi.string().default("root"),
})