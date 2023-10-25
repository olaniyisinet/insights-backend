#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { InsightsBackendStack } from '../lib/insights-backend-stack';
import {InsightsBackendPipeline} from '../lib/insights-backend-pipeline';
import { getConfig } from '../lib/build-config';

const app = new cdk.App();
const buildConfig = getConfig(app);

if (buildConfig.pipelineMode) {
    // production and test environments getting created thought the pipeline
    // So, prifixing the pipeline as 'Prod'
    // run the pieline mode via [cdk deploy/destroy -c pipeline=true]
    const pipelineName = 'ProdInsightsBackendPipeline';
    new InsightsBackendPipeline(app, pipelineName, {
      env: {
        account: buildConfig.awsAccountId,
        region: buildConfig.region
      }
    });
  
    app.synth();
  
} else {
    // if not piepline mode then create the corresponding environment manually
    const stackId = `${buildConfig.envPrefix}BackendStack`;
    new InsightsBackendStack(app, stackId , buildConfig, {
        stackName: stackId,
        env: {
            account: buildConfig.awsAccountId,
            region: buildConfig.region
        }
    });
}
