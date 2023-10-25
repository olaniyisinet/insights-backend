import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
import { BuildConfig } from './build-config';
import { DynamoUserTable } from './construct-dynamodb-user';
import { DynamoTenantTable } from './construct-dynamodb-tenant';
import { LambdaApi } from "./construct-lambda-api";
import {CognitoUserPool } from './construct-cognito-pool';

export class InsightsBackendStack extends Stack {
  constructor( scope: Construct, id: string, buildConfig: BuildConfig, props?: StackProps) {
    super(scope, id, props);

    // create database schema
    const dynamoUsersTable = new DynamoUserTable(this, "UserTable", buildConfig);
    const dynamoTenantTable = new DynamoTenantTable(this, "TenantTable", buildConfig);

    // create the cognito user pool
    const coginitoUserPool = new CognitoUserPool(this, buildConfig);

    // create the api end point
    const lambdaApi = new LambdaApi(this, buildConfig, {
      userPool: coginitoUserPool,
      dynamoUsersTable: dynamoUsersTable,
      dynamoTenantTable: dynamoTenantTable,
    });
  }
}
