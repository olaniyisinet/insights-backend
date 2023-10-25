import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { InsightsBackendStack } from './insights-backend-stack';
import { BuildConfig } from './build-config';


export class InsightsBackendStage extends cdk.Stage {

    constructor(scope: Construct, id: string, buildConfig: BuildConfig, props?: cdk.StageProps) {
        super(scope, id, props);
        const stackId = `${buildConfig.envPrefix}BackendStack`;
        new InsightsBackendStack(this, stackId, buildConfig, {
            stackName: stackId,
            env: {
                account: buildConfig.awsAccountId,
                region: buildConfig.region
            }
        });
    }
}