.PHONY: deploy build tag login

# ----------------------------------------------------------------------------------------------------------------------
# Project Configuration - Configure via ENV vars
# ----------------------------------------------------------------------------------------------------------------------
include .env
export $(shell sed 's/=.*//' .env)

ECR_TAG="${ECR_REPO}:${ECR_VERSION}"
ECR_REPO_PATH="${ACCOUNT}.dkr.ecr.eu-central-1.amazonaws.com/${ECR_TAG}"
# ----------------------------------------------------------------------------------------------------------------------
# Build and deployment tasks
# ----------------------------------------------------------------------------------------------------------------------
build:
	@docker build --platform ${DOCKER_PLATFORM} -t  ${ECR_REPO} .

tag:
	@docker tag ${ECR_TAG} ${ECR_REPO_PATH}


login:
	@aws ecr get-login-password --region ${REGION} | docker login --username AWS --password-stdin ${ACCOUNT}.dkr.ecr.eu-central-1.amazonaws.com

deploy: build tag login
	docker push ${ECR_REPO_PATH}

