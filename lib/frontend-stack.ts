import * as cdk from '@aws-cdk/core'
import { ICluster } from '@aws-cdk/aws-ecs';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IHostedZone } from '@aws-cdk/aws-route53';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as alb from "@aws-cdk/aws-ecs-patterns";
import * as elbv2 from "@aws-cdk/aws-elasticloadbalancingv2"

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account:process.env.CDK_DEFAULT_ACCOUNT
}
export class FrontendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string,HEW2021_Cluster: ICluster, raityupiyodev: IHostedZone, certificate:ICertificate , props?: cdk.StackProps) {
    super(scope, id, props ? props : { env });

    // The code that defines your stack goes here
    //? Front Service
    //! Front Repository
    const FrontRepository = ecr.Repository.fromRepositoryName(this,
      "hew_front",
      "hew_front"
    )

    //! Front Task Create
    const FrontTask      = new ecs.FargateTaskDefinition(this, "FrontTask")
    const FrontContainer = FrontTask.addContainer("FrontContainer", {
      image: ecs.ContainerImage.fromEcrRepository(FrontRepository, "v1.0.6"),
      logging: ecs.LogDrivers.awsLogs({
        streamPrefix: "FrontLogs"
      })
    })
    FrontContainer.addPortMappings({
      hostPort: 80,
      containerPort: 80
    })

    const FrontALB = new alb.ApplicationLoadBalancedFargateService(this, "FrontService", {
      cluster: HEW2021_Cluster,
      memoryLimitMiB: 256,
      cpu: 256,
      desiredCount: 1,
      taskDefinition: FrontTask,
      protocol: elbv2.ApplicationProtocol.HTTPS,
      redirectHTTP: true,
      certificate: certificate,
      domainName: "raityupiyo.dev",
      domainZone: raityupiyodev,
    })
    FrontALB.targetGroup.configureHealthCheck({
      path: '/',
      port: '80'
    })
  }
}
