import { uploadService } from "./src/services/upload";
import { processService } from "./src/services/process";
import * as pulumi from "@pulumi/pulumi";
import { appLoadBalancer } from "./src/load-balancer";
import { rabbitMQService } from "./src/services/rabbitmq";

export const uploadId = uploadService.service.id;
export const processId = processService.service.id;
export const rabbitMQId = rabbitMQService.service.id;
export const uploadUrl = pulumi.interpolate`http://${appLoadBalancer.loadBalancer.dnsName}:3333`;
export const processUrl = pulumi.interpolate`http://${appLoadBalancer.loadBalancer.dnsName}:3334`;
export const rabbitMQAdminUrl = pulumi.interpolate`http://${appLoadBalancer.loadBalancer.dnsName}:15672`;
