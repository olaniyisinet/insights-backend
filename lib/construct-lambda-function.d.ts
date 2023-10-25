import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apiGateway from 'aws-cdk-lib/aws-apigateway';
export interface LambdaFunctionProps {
    readonly httpMethod: string;
    readonly httpRelativePath?: string;
    readonly apiEndpoint: apiGateway.RestApi;
    readonly environment?: {
        [key: string]: string;
    };
    readonly includePackage?: string;
}
export declare class LambdaFunction extends Construct {
    readonly lambdaFunction: lambda.Function;
    constructor(scope: Construct, id: string, props: LambdaFunctionProps);
}
