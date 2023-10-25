import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { BuildConfig } from './build-config';
import { RemovalPolicy } from 'aws-cdk-lib';
  
export class DynamoUserTable extends Construct {

    public readonly table: dynamodb.Table;
    public readonly tableName: string;

    constructor(scope: Construct, id: string, buildConfig: BuildConfig) {
        super(scope, `${buildConfig.envPrefix}${id}`);

        const tableName = `${buildConfig.envPrefix}${id}`;

        const dynamoTable = new dynamodb.Table(this, tableName, { 
            partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
            sortKey: {name: 'userEmail', type: dynamodb.AttributeType.STRING},
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableName: tableName,
            removalPolicy: RemovalPolicy.RETAIN
        });

        dynamoTable.addGlobalSecondaryIndex({
            indexName: 'userEmailIndex',
            partitionKey: {name: 'userEmail', type: dynamodb.AttributeType.STRING},
            sortKey: {name: 'userStatus', type: dynamodb.AttributeType.STRING},
            projectionType: dynamodb.ProjectionType.KEYS_ONLY,
        });

        this.table = dynamoTable;
        this.tableName = tableName;
    }
}