import { uploadService } from "./src/services/upload";
import { processService } from "./src/services/process";
import { authService } from "./src/services/auth";

import * as pulumi from "@pulumi/pulumi";
import { appLoadBalancer } from "./src/load-balancer";
import { rabbitMQService } from "./src/services/rabbitmq";

export const uploadId = uploadService.service.id;
export const processId = processService.service.id;
export const rabbitMQId = rabbitMQService.service.id;
export const authId = authService.service.id;
export const uploadUrl = pulumi.interpolate`http://${appLoadBalancer.loadBalancer.dnsName}:3333`;
export const processUrl = pulumi.interpolate`http://${appLoadBalancer.loadBalancer.dnsName}:3334`;
export const authUrl = pulumi.interpolate`http://${appLoadBalancer.loadBalancer.dnsName}:3335`;
export const rabbitMQAdminUrl = pulumi.interpolate`http://${appLoadBalancer.loadBalancer.dnsName}:15672`;
