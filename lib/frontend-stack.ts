import * as cdk from '@aws-cdk/core'
import { ICluster } from '@aws-cdk/aws-ecs';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';
import { IHostedZone } from '@aws-cdk/aws-route53';
import { Repository } from '@aws-cdk/aws-ecr'
import { FargateTaskDefinition, ContainerImage, LogDrivers } from '@aws-cdk/aws-ecs';
import { ApplicationLoadBalancedFargateService } from "@aws-cdk/aws-ecs-patterns";
import { ApplicationProtocol } from '@aws-cdk/aws-elasticloadbalancingv2';

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
    const FrontRepository = Repository.fromRepositoryName(this,
      "hew_front",
      "hew_front"
    )

    //! Front Task Create
    const FrontTask      = new FargateTaskDefinition(this, "FrontTask")
    const FrontContainer = FrontTask.addContainer("FrontContainer", {
      image: ContainerImage.fromEcrRepository(FrontRepository, "v1.0.7"),
      logging: LogDrivers.awsLogs({
        streamPrefix: "FrontLogs"
      })
    })
    FrontContainer.addPortMappings({
      hostPort: 80,
      containerPort: 80
    })

    const FrontALB = new ApplicationLoadBalancedFargateService(this, "FrontService", {
      cluster: HEW2021_Cluster,
      memoryLimitMiB: 256,
      cpu: 256,
      desiredCount: 1,
      taskDefinition: FrontTask,
      protocol: ApplicationProtocol.HTTPS,
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
