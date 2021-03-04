import * as cdk from '@aws-cdk/core';
import { IVpc,Vpc } from '@aws-cdk/aws-ec2';
import { ICluster,Cluster } from '@aws-cdk/aws-ecs';
import { IHostedZone,HostedZone } from '@aws-cdk/aws-route53';
import { ICertificate,Certificate } from '@aws-cdk/aws-certificatemanager';

const env = {
  region: process.env.CDK_DEFAULT_REGION,
  account:process.env.CDK_DEFAULT_ACCOUNT
}

export class BaseStack extends cdk.Stack {
  public readonly HEW2021_VPC: IVpc
  public readonly HEW2021_Cluster: ICluster
  public readonly raityupiyodev: IHostedZone
  public readonly certificate :ICertificate
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props ? props : { env });
    // The code that defines your stack goes here
    //! CreateVPC
    this.HEW2021_VPC = new Vpc(this, "HEW2021_VPC", {
      maxAzs: 2
    })

    //! Create Cluster
    this.HEW2021_Cluster = new Cluster(this, "ecs-cluster", {
      vpc: this.HEW2021_VPC,
      containerInsights: true
    })

    //! Create Route53 LookUp
    this.raityupiyodev = HostedZone.fromLookup(this, "raityupiyoHostZone", {
      domainName: "raityupiyo.dev."
    })

    //! Create DNS SSL certificate
    this.certificate = Certificate.fromCertificateArn(this, "Certificate",
      "arn:aws:acm:ap-northeast-1:933345684592:certificate/b1472c9c-9998-471e-8880-180cc3b85722"
    )
  }
}