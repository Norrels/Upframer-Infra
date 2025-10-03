import * as awsx from "@pulumi/awsx";
import { authDockerImagem } from "../images/images";
import { cluster } from "../cluster";
import { appLoadBalancer } from "../load-balancer";
import { ecsRole } from "../roles/ecs-roles";
import { DATABASE_URL_AUTH, JWT_SECRET } from "../config/env";

const authTargetGroup = appLoadBalancer.createTargetGroup("auth-target", {
  port: 3335,
  protocol: "HTTP",
  healthCheck: {
    path: "/health",
    protocol: "HTTP",
    port: "3335",
    interval: 30,
    timeout: 5,
    healthyThreshold: 2,
    unhealthyThreshold: 5,
    matcher: "200,404",
  },
});

export const authHttpListener = appLoadBalancer.createListener(
  "auth-listener",
  {
    port: 3335,
    protocol: "HTTP",
    targetGroup: authTargetGroup,
  }
);

export const authService = new awsx.classic.ecs.FargateService("fargate-auth", {
  cluster,
  desiredCount: 1,
  waitForSteadyState: false,
  taskDefinitionArgs: {
    taskRole: ecsRole,
    executionRole: ecsRole,
    container: {
      image: authDockerImagem.ref,
      cpu: 256,
      memory: 512,
      portMappings: [authHttpListener],
      environment: [
        {
          name: "DATABASE_URL",
          value: DATABASE_URL_AUTH,
        },
        {
          name: "JWT_SECRET",
          value: JWT_SECRET,
        },
        {
          name: "PORT",
          value: "3335",
        },
        {
          name: "NODE_ENV",
          value: "production",
        },
      ],
    },
  },
});
