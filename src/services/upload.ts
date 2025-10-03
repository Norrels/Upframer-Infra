import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import { uploadDockerImagem } from "../images/images";
import { cluster } from "../cluster";
import { appLoadBalancer, networkLoadBalancer } from "../load-balancer";
import { ecsRole } from "../roles/ecs-roles";
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
  AWS_REGION,
  DATABASE_URL_UPLOAD,
  JWT_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
} from "../config/env";
import { s3BucketName } from "../storage/s3";

const uploadTargetGroup = appLoadBalancer.createTargetGroup("upload-target", {
  port: 3333,
  protocol: "HTTP",
  healthCheck: {
    path: "/health",
    protocol: "HTTP",
    port: "3333",
    interval: 30,
    timeout: 5,
    healthyThreshold: 2,
    unhealthyThreshold: 5,
    matcher: "200,404",
  },
});

export const uploadHttpListener = appLoadBalancer.createListener(
  "upload-listener",
  {
    port: 3333,
    protocol: "HTTP",
    targetGroup: uploadTargetGroup,
  }
);

export const uploadService = new awsx.classic.ecs.FargateService(
  "fargate-upload",
  {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
      taskRole: ecsRole,
      executionRole: ecsRole,
      container: {
        image: uploadDockerImagem.ref,
        cpu: 256,
        memory: 512,
        portMappings: [uploadHttpListener],
        environment: [
          {
            name: "NODE_ENV",
            value: "production",
          },
          {
            name: "PORT",
            value: "3333",
          },
          {
            name: "RABBITMQ_URL",
            value: pulumi.interpolate`amqp://admin:admin@${networkLoadBalancer.loadBalancer.dnsName}:5672`,
          },
          {
            name: "RABBITMQ_QUEUE_STATUS_CHANGE",
            value: "video-processing-result",
          },
          {
            name: "RABBITMQ_QUEUE_CREATED",
            value: "job-creation",
          },
          {
            name: "DATABASE_URL",
            value: DATABASE_URL_UPLOAD,
          },
          {
            name: "AWS_ACCESS_KEY_ID",
            value: AWS_ACCESS_KEY_ID,
          },
          {
            name: "AWS_SECRET_ACCESS_KEY",
            value: AWS_SECRET_ACCESS_KEY,
          },
          {
            name: "AWS_SESSION_TOKEN",
            value: AWS_SESSION_TOKEN,
          },
          {
            name: "AWS_REGION",
            value: AWS_REGION,
          },
          {
            name: "AWS_S3_BUCKET_NAME",
            value: s3BucketName,
          },
          {
            name: "JWT_SECRET",
            value: JWT_SECRET,
          },
          {
            name: "SMTP_HOST",
            value: SMTP_HOST,
          },
          {
            name: "SMTP_PORT",
            value: SMTP_PORT,
          },
          {
            name: "SMTP_SECURE",
            value: SMTP_SECURE,
          },
          {
            name: "SMTP_USER",
            value: SMTP_USER,
          },
          {
            name: "SMTP_PASS",
            value: SMTP_PASS,
          },
        ],
      },
    },
  }
);
