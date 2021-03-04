import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';
import * as alb from "@aws-cdk/aws-ecs-patterns";
import { ICluster } from '@aws-cdk/aws-ecs';
import { IHostedZone } from '@aws-cdk/aws-route53';

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account:process.env.CDK_DEFAULT_ACCOUNT
}

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, HEW2021_Cluster: ICluster, raityupiyodev: IHostedZone ,props?: cdk.StackProps) {
    super(scope, id, props ? props : { env });

    // //? RecruitAPI Service
    // //! RecruitAPI Repository
    const RecruitRepository = ecr.Repository.fromRepositoryName(this,
      "recruit_api",
      "recruit_api",
    )

    //! RecruitAPI Task Create
    const RecruitTask      = new ecs.FargateTaskDefinition(this, "RecruitTask")
    const RecruitContainer = RecruitTask.addContainer("RecruitContainer", {
      image: ecs.ContainerImage.fromEcrRepository(RecruitRepository, "v1.1.0"),
      environment: {
        AWS_ACCESS_KEY_ID: "AKIA5ST545RYD6ST62AO",
        AWS_SECRET_ACCESS_KEY: "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",
        ENDPOINT: "https://dynamodb.ap-northeast-1.amazonaws.com",
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: "RecruitLogs"
      })
    })
    RecruitContainer.addPortMappings({
      hostPort: 60002,
      containerPort: 60002
    })
    RecruitContainer.addToExecutionPolicy

    //! RecruitTadsk ALB Create
    const RecruitALB = new alb.ApplicationLoadBalancedFargateService(this, "RecruitService", {
      cluster: HEW2021_Cluster,
      memoryLimitMiB: 256,
      cpu: 256,
      desiredCount: 1,
      taskDefinition: RecruitTask,
      listenerPort: 60002,
      domainName: "recruit.raityupiyo.dev",
      domainZone: raityupiyodev,
    })
    RecruitALB.targetGroup.configureHealthCheck({
      path: '/recruits',
      port: '60002'
    })

    //? EndUserAPI Service
    const EndUseRepository = ecr.Repository.fromRepositoryName(this,
      "end_user_api",
      "end_user_api",
    )

    //! EndUserAPI Task Create
    const EndUserTask      = new ecs.FargateTaskDefinition(this, "EndUserTask")
    const EndUserContainer = EndUserTask.addContainer("EndUserContainer", {
      image: ecs.ContainerImage.fromEcrRepository(EndUseRepository, "v1.0.9"),
      environment: {
        AWS_ACCESS_KEY_ID: "AKIA5ST545RYD6ST62AO",
        AWS_SECRET_ACCESS_KEY: "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",
        ENDPOINT: "https://dynamodb.ap-northeast-1.amazonaws.com",
      },
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: "EndUserLogs"
      })
    })
    EndUserContainer.addPortMappings({
      hostPort: 60001,
      containerPort: 60001
    })

    //! EndUserTask ALB Create
    const EndUserALB = new alb.ApplicationLoadBalancedFargateService(this, "EndUserService", {
      cluster: HEW2021_Cluster,
      memoryLimitMiB: 256,
      cpu: 256,
      desiredCount: 1,
      taskDefinition: EndUserTask,
      listenerPort: 60001,
      domainName: "enduser.raityupiyo.dev",
      domainZone: raityupiyodev,
    })
    EndUserALB.targetGroup.configureHealthCheck({
      path: '/users',
      port: '60001'
    })

    //? ConnpassAPI Service
    //! ConnpassAPI Repository
    const ConnpassRepository = ecr.Repository.fromRepositoryName(this,
      "connpass_api",
      "connpass_api",
    )

    //! ConnpassAPI Task Create
    const ConnpassTask      = new ecs.FargateTaskDefinition(this, "ConnpassTask")
    const ConnpassContainer = ConnpassTask.addContainer("ConnpassContainer", {
      image: ecs.ContainerImage.fromEcrRepository(ConnpassRepository, "v1.0.1"),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: "ConnpassLogs"
      })
    })
    ConnpassContainer.addPortMappings({
      hostPort: 60003,
      containerPort: 60003
    })

    //! ConnpassAPI ALB Create
    const ConnpassALB = new alb.ApplicationLoadBalancedFargateService(this, "ConnpassService", {
      cluster: HEW2021_Cluster,
      memoryLimitMiB: 256,
      cpu: 256,
      desiredCount: 1,
      taskDefinition: ConnpassTask,
      listenerPort: 60003,
      domainName: "connpass.raityupiyo.dev",
      domainZone: raityupiyodev,
    })
    ConnpassALB.targetGroup.configureHealthCheck({
      path: '/connpass',
      port: '60003'
    })
  }
}