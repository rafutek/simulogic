import * as Joi from "joi";

/**
 * Dynamic path to the environment config file.
 * Environment variable NODE_ENV (used to set this filepath)
 * should be defined automatically before by your command as you can see below.
 * 
 * 'yarn start' -> NODE_ENV=development
 * 
 * 'yarn test' -> NODE_ENV=test
 * 
 * 'yarn build --prod' -> NODE_ENV=production
 */
export const env_filepath = `${process.cwd()}/config/.env.${process.env.NODE_ENV}`;

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