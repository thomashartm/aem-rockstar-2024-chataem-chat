# AEM Rockstar 2024 - Chat AEM Assistant

Demo project for the AEM Rockstar 2024 competition.

## Description
This is a serverside rendered chat application to help users with AEM related queries.

## Getting Started

To run the development server execute the following commands:

```bash
nvm use
npm i
npm run dev
```

Make sure that the all required environment variables are set:

    DB_SECRET_NAME=<Name of the DB credentials secret>
    DB_SETTINGS_NAME=<Name of the system manager settings property>
    OPENAI_API_KEY=<Name open API settings secret>


Open [http://localhost:8080](http://localhost:8080) with your browser to see the result.

# Working with Docker

Build the docker container for local development

On Intel based hardware use the following command:

    docker build --platform linux/amd64 -t  chataemclient .

On Mac M1 and M2 use the following command:

    docker build --platform linux/arm64 -t  chataemclient .

Run the docker container

    docker run -p 8080:8080 -d --name=chat chataemclient


# How to build and deploy

## Prerequisites

Using make to build and run the project requires to set up a local env file

    touch .env

Then add the following environment variables to the .env file and replace the values with your own:

    REGION=<aws-region>
    ACCOUNT=<your-account-id>
    ECR_REPO=<ecr repo name>
    ECR_VERSION=latest
    DOCKER_PLATFORM=linux/arm64

## Deploy the container to your AWS ECR 
  
  make deploy

