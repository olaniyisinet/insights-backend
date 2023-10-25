import { Construct } from 'constructs';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { BuildConfig } from './build-config';
import { DynamoUserTable } from './construct-dynamodb-user';
import { DynamoTenantTable } from './construct-dynamodb-tenant';
import { CognitoUserPool } from './construct-cognito-pool';
export interface LambdaApiProps {
    readonly userPool: CognitoUserPool;
    readonly dynamoUsersTable: DynamoUserTable;
    readonly dynamoTenantTable: DynamoTenantTable;
}
export declare class LambdaApi extends Construct {
    readonly apiEndpoint: apiGateway.RestApi;
    constructor(scope: Construct, buildConfig: BuildConfig, props: LambdaApiProps);
}
