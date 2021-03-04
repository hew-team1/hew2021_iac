import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Hew2021 from '../lib/hew2021-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Hew2021.Hew2021Stack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
