import * as aws from "@pulumi/aws";

const uploadECRRepository = aws.ecr.getRepository({
  name: "upframer-upload",
});

const processECRRepository = aws.ecr.getRepository({
  name: "upframer-worker",
});


export const uploadDockerImagem = {
  ref: uploadECRRepository.then((repo) => `${repo.repositoryUrl}:latest`),
};

export const processDockerImagem = {
  ref: processECRRepository.then((repo) => `${repo.repositoryUrl}:latest`),
};
