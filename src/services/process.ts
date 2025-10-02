import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import { processDockerImagem } from "../images/images";
import { cluster } from "../cluster";
import { networkLoadBalancer, appLoadBalancer } from "../load-balancer";
import { labRole } from "../roles/lab-roles";
import {
  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
} from "../config/env";

const processTargetGroup = appLoadBalancer.createTargetGroup("process-target", {
  port: 3334,
  protocol: "HTTP",
  healthCheck: {
    path: "/health",
    protocol: "HTTP",
    port: "3334",
    interval: 30,
    timeout: 5,
    healthyThreshold: 2,
    unhealthyThreshold: 5,
    matcher: "200,404",
  },
});

export const processHttpListener = appLoadBalancer.createListener(
  "process-listener",
  {
    port: 3334,
    protocol: "HTTP",
    targetGroup: processTargetGroup,
  }
);

export const processService = new awsx.classic.ecs.FargateService(
  "fargate-process",
  {
    cluster,
    desiredCount: 1,
    waitForSteadyState: false,
    taskDefinitionArgs: {
      taskRole: labRole,
      executionRole: labRole,
      container: {
        image: processDockerImagem.ref,
        cpu: 256,
        memory: 512,
        portMappings: [processHttpListener],
        environment: [
          {
            name: "ENVIRONMENT",
            value: "development",
          },
          {
            name: "AWS_BUCKET",
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
          {
            name: "RABBITMQ_URL",
            value: pulumi.interpolate`amqp://admin:admin@${networkLoadBalancer.loadBalancer.dnsName}:5672`,
          },
          {
            name: "BROKER_URL",
            value: pulumi.interpolate`amqp://admin:admin@${networkLoadBalancer.loadBalancer.dnsName}:5672`,
          },
        ],
      },
    },
  }
);
