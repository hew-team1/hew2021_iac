import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as route53 from '@aws-cdk/aws-route53';
import * as cert from '@aws-cdk/aws-certificatemanager';
import { IVpc } from '@aws-cdk/aws-ec2';
import { ICluster } from '@aws-cdk/aws-ecs';
import { IHostedZone } from '@aws-cdk/aws-route53';
import { ICertificate } from '@aws-cdk/aws-certificatemanager';

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
    this.HEW2021_VPC = new ec2.Vpc(this, "HEW2021_VPC", {
      maxAzs: 2
    })

    //! Create Cluster
    this.HEW2021_Cluster = new ecs.Cluster(this, "ecs-cluster", {
      vpc: this.HEW2021_VPC,
      containerInsights: true
    })

    //! Create Route53 LookUp
    this.raityupiyodev = route53.HostedZone.fromLookup(this, "raityupiyoHostZone", {
      domainName: "raityupiyo.dev."
    })

    //! Create DNS SSL certificate
    this.certificate = cert.Certificate.fromCertificateArn(this, "Certificate",
      "arn:aws:acm:ap-northeast-1:933345684592:certificate/b1472c9c-9998-471e-8880-180cc3b85722"
    )
  }
}