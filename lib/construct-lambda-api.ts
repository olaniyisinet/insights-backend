import { Construct } from 'constructs';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { BuildConfig } from './build-config';
import { LambdaFunction } from './construct-lambda-function';
import { DynamoUserTable } from './construct-dynamodb-user';
import { DynamoTenantTable } from './construct-dynamodb-tenant';
import { CognitoUserPool } from './construct-cognito-pool';

export interface LambdaApiProps {
    readonly userPool: CognitoUserPool;
    readonly dynamoUsersTable: DynamoUserTable;
    readonly dynamoTenantTable: DynamoTenantTable;
}
  
export class LambdaApi extends Construct {

    public readonly apiEndpoint: apiGateway.RestApi;

    constructor(scope: Construct, buildConfig: BuildConfig,  props: LambdaApiProps) {
        super(scope, '_');

        const apiEndpoint = new apiGateway.RestApi(this,  `${buildConfig.envPrefix}BackendApi`, {
            deployOptions: {
              stageName: buildConfig.env,
            },
            defaultCorsPreflightOptions: {
                allowOrigins: apiGateway.Cors.ALL_ORIGINS,
                allowMethods: apiGateway.Cors.ALL_METHODS
            }
        });

        const echoGetGreeting = new LambdaFunction(this, 'echoGetGreeting', {
            httpMethod: 'GET',
            apiEndpoint: apiEndpoint,
        }); 
    
        const echoGetMessage = new LambdaFunction(this, 'echoGetMessage', {
            httpMethod: 'GET',
            httpRelativePath: 'echo-get',
            apiEndpoint: apiEndpoint,
        }); 
    
        const echoPostMessage = new LambdaFunction(this, 'echoPostMessage', {
            httpMethod: 'POST',
            httpRelativePath: 'echo-post',
            apiEndpoint: apiEndpoint,
        }); 
    
        const userInitialSetup = new LambdaFunction(this, 'userInitialSetup', {
            httpMethod: 'POST',
            httpRelativePath: 'user-initial-setup',
            apiEndpoint: apiEndpoint,
            environment: {
                USER_TABLE_NAME: props.dynamoUsersTable.tableName,
                TENANT_TABLE_NAME: props.dynamoTenantTable.tableName
            }
        }); 
        props.dynamoUsersTable.table.grantReadWriteData(userInitialSetup.lambdaFunction);
        props.dynamoTenantTable.table.grantReadData(userInitialSetup.lambdaFunction);
    
        const userLoadProfile = new LambdaFunction(this, 'userLoadProfile', {
            httpMethod: 'POST',
            httpRelativePath: 'user-load-profile',
            apiEndpoint: apiEndpoint,
            environment: {
                USER_TABLE_NAME: props.dynamoUsersTable.tableName,
                TENANT_TABLE_NAME: props.dynamoTenantTable.tableName
            }
        }); 
        props.dynamoUsersTable.table.grantReadWriteData(userLoadProfile.lambdaFunction);
        props.dynamoTenantTable.table.grantReadData(userLoadProfile.lambdaFunction);

        const graphByName = new LambdaFunction(this, 'graphByName', {
            httpMethod: 'POST',
            httpRelativePath: 'graph-by-name',
            apiEndpoint: apiEndpoint,
            includePackage: 'graph',
            environment: {
                USER_TABLE_NAME: props.dynamoUsersTable.tableName,
                TENANT_TABLE_NAME: props.dynamoTenantTable.tableName
            }
        }); 
        props.dynamoUsersTable.table.grantReadWriteData(graphByName.lambdaFunction);
        props.dynamoTenantTable.table.grantReadData(graphByName.lambdaFunction);

        this.apiEndpoint = apiEndpoint;
    }
}