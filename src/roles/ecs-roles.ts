import * as aws from "@pulumi/aws";

export const ecsRole = new aws.iam.Role("ecsTaskExecutionRole", {
  assumeRolePolicy: JSON.stringify({
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: {
          Service: "ecs-tasks.amazonaws.com",
        },
        Action: "sts:AssumeRole",
      },
    ],
  }),
  tags: {
    Name: "ecs-task-execution-role",
  },
});

const ecsTaskExecutionPolicyAttachment = new aws.iam.RolePolicyAttachment(
  "ecsTaskExecutionPolicyAttachment",
  {
    role: ecsRole.name,
    policyArn: "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
  }
);

const s3FullAccessPolicyAttachment = new aws.iam.RolePolicyAttachment(
  "s3FullAccessPolicyAttachment",
  {
    role: ecsRole.name,
    policyArn: "arn:aws:iam::aws:policy/AmazonS3FullAccess",
  }
);
