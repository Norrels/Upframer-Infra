import * as aws from "@pulumi/aws";
import { AWS_BUCKET_NAME } from "../config/env";

export const s3Bucket = new aws.s3.Bucket("upframer-bucket", {
  bucket: AWS_BUCKET_NAME,
  tags: {
    Name: "upframer-storage",
    Environment: "production",
  },
});

export const s3BucketPublicAccessBlock = new aws.s3.BucketPublicAccessBlock(
  "upframer-bucket-public-access-block",
  {
    bucket: s3Bucket.id,
    blockPublicAcls: true,
    blockPublicPolicy: true,
    ignorePublicAcls: true,
    restrictPublicBuckets: true,
  }
);

export const s3BucketCors = new aws.s3.BucketCorsConfiguration(
  "upframer-bucket-cors",
  {
    bucket: s3Bucket.id,
    corsRules: [
      {
        allowedHeaders: ["*"],
        allowedMethods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
        allowedOrigins: ["*"],
        exposeHeaders: ["ETag"],
        maxAgeSeconds: 3000,
      },
    ],
  }
);

export const s3BucketVersioning = new aws.s3.BucketVersioning(
  "upframer-bucket-versioning",
  {
    bucket: s3Bucket.id,
    versioningConfiguration: {
      status: "Disabled",
    },
  }
);

export const s3BucketEncryption = new aws.s3.BucketServerSideEncryptionConfiguration(
  "upframer-bucket-encryption",
  {
    bucket: s3Bucket.id,
    rules: [
      {
        applyServerSideEncryptionByDefault: {
          sseAlgorithm: "AES256",
        },
      },
    ],
  }
);

export const s3BucketName = s3Bucket.id;
export const s3BucketArn = s3Bucket.arn;
