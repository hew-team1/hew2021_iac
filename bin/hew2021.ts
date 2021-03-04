#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BaseStack } from '../lib/base-stack';
import { DynamoDBStack } from '../lib/dynamodb-stack';
import { BackendStack } from '../lib/backend-stack';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();
const basestack = new BaseStack(app, 'BaseStack');
new BackendStack(app, "BackendStack", basestack.HEW2021_Cluster, basestack.raityupiyodev);
new FrontendStack(app, "FrontendStack",basestack.HEW2021_Cluster, basestack.raityupiyodev, basestack.certificate)
new DynamoDBStack(app, 'DynamoDBStack');
