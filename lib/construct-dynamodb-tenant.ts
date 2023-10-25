import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { BuildConfig } from './build-config';
import { RemovalPolicy } from 'aws-cdk-lib';
  
export class DynamoTenantTable extends Construct {

    public readonly table: dynamodb.Table;
    public readonly tableName: string;

    constructor(scope: Construct, id: string, buildConfig: BuildConfig) {
        super(scope, `${buildConfig.envPrefix}${id}`);

        const tableName = `${buildConfig.envPrefix}${id}`;

        const dynamoTable = new dynamodb.Table(this, tableName, { 
            partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
            sortKey: {name: 'tenantCode', type: dynamodb.AttributeType.STRING},
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
            tableName: tableName,
            removalPolicy: RemovalPolicy.RETAIN
        });

        dynamoTable.addGlobalSecondaryIndex({
            indexName: 'tenantCodeIndex',
            partitionKey: {name: 'tenantCode', type: dynamodb.AttributeType.STRING},
            sortKey: {name: 'tenantStatus', type: dynamodb.AttributeType.STRING},
            projectionType: dynamodb.ProjectionType.ALL,
        });

        this.table = dynamoTable;
        this.tableName = tableName;
    }
}