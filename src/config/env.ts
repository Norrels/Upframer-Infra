import * as pulumi from "@pulumi/pulumi";

const config = new pulumi.Config();

export const AWS_REGION = config.get("awsRegion") || "us-east-1";

export const AWS_BUCKET_NAME = config.requireSecret("awsBucketName") || "";
export const AWS_ACCESS_KEY_ID = config.requireSecret("awsAccessKeyId");
export const AWS_SECRET_ACCESS_KEY = config.requireSecret("awsSecretAccessKey");
export const AWS_SESSION_TOKEN = config.getSecret("awsSessionToken") || "";
export const DATABASE_URL_UPLOAD = config.requireSecret("databaseUrlUpload");
export const DATABASE_URL_AUTH = config.requireSecret("databaseUrlAuth");
export const RABBITMQ_DEFAULT_USER =
  config.get("rabbitmqDefaultUser") || "admin";
export const RABBITMQ_DEFAULT_PASS = config.requireSecret(
  "rabbitmqDefaultPass"
);
export const JWT_SECRET = config.requireSecret("jwtSecret");
export const SMTP_HOST = config.require("smtpHost");
export const SMTP_PORT = config.get("smtpPort") || "587";
export const SMTP_SECURE = config.get("smtpSecure") || "false";
export const SMTP_USER = config.require("smtpUser");
export const SMTP_PASS = config.requireSecret("smtpPass");
