import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { BuildConfig } from './build-config';
export declare class CognitoUserPool extends Construct {
    readonly userPool: cognito.UserPool;
    readonly appClient: cognito.UserPoolClient;
    constructor(scope: Construct, buildConfig: BuildConfig);
}
