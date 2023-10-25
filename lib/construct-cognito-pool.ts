import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { BuildConfig } from './build-config';
  
export class CognitoUserPool extends Construct {

    public readonly userPool: cognito.UserPool;
    public readonly appClient: cognito.UserPoolClient;

    constructor(scope: Construct, buildConfig: BuildConfig) {
        super(scope, `${buildConfig.envPrefix}UserPool`);
        let poolName = `${buildConfig.envPrefix}UserPool`;

        const pool = new cognito.UserPool(this, poolName , {
            userPoolName: poolName,
            signInAliases: {
                email: true,
            },
            selfSignUpEnabled: true,
            autoVerify: {
                email: true,
            },
            standardAttributes: {
                email: {
                  mutable: false,
                  required: true,
                },
            },            
            keepOriginal: {
                email: true,
            },
            userVerification: {
                emailSubject: `${buildConfig.appName} | You need to verify your email`,
                emailBody: `Thanks for signing up with ${buildConfig.appName}. Your verification code is {####}`,
                emailStyle: cognito.VerificationEmailStyle.CODE,
            },
            accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
          });

        let clientName = `${buildConfig.envPrefix}UserClient`;
        const client = pool.addClient(clientName, {
            userPoolClientName: clientName,
            authFlows: {
              userSrp: true,
            },
        });

        this.userPool = pool;
        this.appClient = client;
    }
}