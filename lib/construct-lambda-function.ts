import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export interface LambdaFunctionProps {
    readonly httpMethod: string;
    readonly httpRelativePath?: string;
    readonly apiEndpoint:  apiGateway.RestApi;
    readonly environment?: { [key: string]: string };
    readonly includePackage?: string;
}
  
export class LambdaFunction extends Construct {

    public readonly lambdaFunction: lambda.Function;

    constructor(scope: Construct, id: string, props: LambdaFunctionProps) {
        super(scope, id);
        let packageName = props.includePackage ? props.includePackage : 'none';

        const lambdaFunc = new lambda.Function(this, id, {
            runtime: lambda.Runtime.NODEJS_18_X,   
            code: lambda.Code.fromAsset('assets/lambda-functions', { 
                exclude: [ 
                    "**", 
                    `!${id}.js`,
                    `!util`,
                    `!util/*`,
                    `!${packageName}`,
                    `!${packageName}/*`
                ]}),  
            handler: `${id}.handler`,
            logRetention: RetentionDays.ONE_MONTH,
            environment: props.environment
        });

        const lambdaApiIntegration = new apiGateway.LambdaIntegration(lambdaFunc);
        if(props.httpRelativePath) {
            const lambdaApiResource = props.apiEndpoint.root.addResource(props.httpRelativePath);
            lambdaApiResource.addMethod(props.httpMethod, lambdaApiIntegration); 
        } else {
            props.apiEndpoint.root.addMethod(props.httpMethod, lambdaApiIntegration); 
        }

        this.lambdaFunction = lambdaFunc;
    }
}