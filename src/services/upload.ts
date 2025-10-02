import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import { uploadDockerImagem } from "../images/images";
import { cluster } from "../cluster";
import { appLoadBalancer, networkLoadBalancer } from "../load-balancer";

import { labRole } from "../roles/lab-roles";
import {
  AWS_ACCESS_KEY_ID,
  AWS_BUCKET_NAME,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
  DATABASE_URL,
} from "../config/env";

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
      taskRole: labRole,
      executionRole: labRole,
      container: {
        image: uploadDockerImagem.ref,
        cpu: 256,
        memory: 512,
        portMappings: [uploadHttpListener],
        environment: [
          {
            name: "RABBITMQ_URL",
            value: pulumi.interpolate`amqp://admin:admin@${networkLoadBalancer.loadBalancer.dnsName}:5672`,
          },
          {
            name: "BROKER_URL",
            value: pulumi.interpolate`amqp://admin:admin@${networkLoadBalancer.loadBalancer.dnsName}:5672`,
          },
          {
            name: "DATABASE_URL",
            value: DATABASE_URL,
          },
          {
            name: "AWS_S3_BUCKET_NAME",
            value: AWS_BUCKET_NAME,
          },
          {
            name: "AWS_REGION",
            value: "us-east-1",
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
        ],
      },
    },
  }
);
