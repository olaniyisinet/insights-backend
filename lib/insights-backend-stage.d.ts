import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { BuildConfig } from './build-config';
export declare class InsightsBackendStage extends cdk.Stage {
    constructor(scope: Construct, id: string, buildConfig: BuildConfig, props?: cdk.StageProps);
}
