import * as aws from "@pulumi/aws";

export const labRole = aws.iam.Role.get("labRole", "LabRole");
