import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { BuildConfig } from './build-config';
export declare class DynamoUserTable extends Construct {
    readonly table: dynamodb.Table;
    readonly tableName: string;
    constructor(scope: Construct, id: string, buildConfig: BuildConfig);
}
