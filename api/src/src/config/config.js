const dotenv = require("dotenv");
const path = require("path");
const Joi = require("joi");
const { json, multipart } = require("./contentTypes");

const rootFolder = path.join(__dirname, "..", "..");
dotenv.config({ path: path.join(rootFolder, ".env") });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid("production", "development").required(),
    PORT: Joi.number().default(3000),
    DATABASE_URL: Joi.string().required().description("SQL DB url"),
    JWT_SECRET: Joi.string().required().description("JWT secret key"),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description("minutes after which access tokens expire"),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description("days after which refresh tokens expire"),
    UPLOAD_TOKEN_LENGTH: Joi.number().positive().default(64).description("upload token length"),
    UPLOAD_TOKEN_EXPIRATION_MINUTES: Joi.number()
      .default(5 * 60)
      .description("minutes after which upload tokens expire"),
    UPLOAD_EXPIRATION_MINUTES: Joi.number()
      .default(24 * 60)
      .description("minutes after which upload expire"),
    UPLOAD_TEMPORARY_FOLDER: Joi.string()
      .default(path.join(rootFolder, "uploads-temp"))
      .description("temporary upload path"),
    UPLOAD_FOLDER: Joi.string().default(path.join(rootFolder, "uploads")).description("upload path"),
    ASSETS_FOLDER: Joi.string().default(path.join(rootFolder, "static", "assets")).description("generic assets path"),
    SMTP_HOST: Joi.string().description("server that will send the emails"),
    SMTP_PORT: Joi.number().description("port to connect to the email server"),
    SMTP_FROM: Joi.string().description("the from field in the emails sent by the app"),
    ADMIN_USER_EMAIL: Joi.string().required().email().description("the email of the first admin"),
    ADMIN_USER_FIRSTNAME: Joi.string().required().description("the first name of the first admin"),
    ADMIN_USER_LASTNAME: Joi.string().required().description("the last name of the first admin"),
    ADMIN_USER_PASSWORD: Joi.string().required().description("the password of the first admin"),
    ADMIN_URL: Joi.string().required().description("the base url to reach the admin area"),
    API_URL: Joi.string().required().description("the base url to reach the api routes"),
    MAX_UPLOAD_SIZE: Joi.string().required().description("the maximum allowed upload size"),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  allowedContentTypes: [json, multipart],
  objection: {
    url: envVars.DATABASE_URL,
    options: {},
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: 30,
  },
  root: {
    folder: rootFolder,
  },
  upload: {
    tokenLength: envVars.UPLOAD_TOKEN_LENGTH,
    tokenExpirationMinutes: envVars.UPLOAD_TOKEN_EXPIRATION_MINUTES,
    expirationMinutes: envVars.UPLOAD_EXPIRATION_MINUTES,
    temporaryFolder: envVars.UPLOAD_TEMPORARY_FOLDER,
    folder: envVars.UPLOAD_FOLDER,
    maxUploadSize: envVars.MAX_UPLOAD_SIZE,
    randomFilenameConfig: {
      length: 40,
      charset: "alphanumeric",
      capitalization: "lowercase",
      readable: true,
    },
  },
  static: {
    assetsFolder: envVars.ASSETS_FOLDER,
  },
  logs: {
    path: path.join(rootFolder, "logs"),
    maxFiles: 90,
    size: "50M",
    maxSize: "500M",
    interval: "1d",
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
    },
    from: envVars.SMTP_FROM,
  },
  adminUser: {
    firstName: envVars.ADMIN_USER_FIRSTNAME,
    lastName: envVars.ADMIN_USER_LASTNAME,
    email: envVars.ADMIN_USER_EMAIL,
    password: envVars.ADMIN_USER_PASSWORD,
    roles: ["admin"],
  },
  admin: {
    url: envVars.ADMIN_URL,
  },
  api: {
    url: envVars.API_URL,
  },
  locales: ["en", "it"], // first one is the fallback
  filterConditions: [
    "eq",
    "ne",
    "gte",
    "lte",
    "gt",
    "lt",
    "like",
    "concatLike",
    "in",
    "existsIn",
    "exists",
    "round",
    "roundLte",
    "roundLt",
    "roundGte",
    "roundGt",
  ],
};
