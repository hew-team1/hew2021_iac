#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { Hew2021Stack } from '../lib/hew2021-stack';

const app = new cdk.App();
new Hew2021Stack(app, 'Hew2021Stack');
