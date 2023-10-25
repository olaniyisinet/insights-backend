"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CognitoUserPool = void 0;
const constructs_1 = require("constructs");
const cdk = require("aws-cdk-lib");
const cognito = require("aws-cdk-lib/aws-cognito");
class CognitoUserPool extends constructs_1.Construct {
    constructor(scope, buildConfig) {
        super(scope, `${buildConfig.envPrefix}UserPool`);
        let poolName = `${buildConfig.envPrefix}UserPool`;
        const pool = new cognito.UserPool(this, poolName, {
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
exports.CognitoUserPool = CognitoUserPool;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0LWNvZ25pdG8tcG9vbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnN0cnVjdC1jb2duaXRvLXBvb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXVDO0FBQ3ZDLG1DQUFtQztBQUNuQyxtREFBbUQ7QUFHbkQsTUFBYSxlQUFnQixTQUFRLHNCQUFTO0lBSzFDLFlBQVksS0FBZ0IsRUFBRSxXQUF3QjtRQUNsRCxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsV0FBVyxDQUFDLFNBQVMsVUFBVSxDQUFDLENBQUM7UUFDakQsSUFBSSxRQUFRLEdBQUcsR0FBRyxXQUFXLENBQUMsU0FBUyxVQUFVLENBQUM7UUFFbEQsTUFBTSxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUc7WUFDL0MsWUFBWSxFQUFFLFFBQVE7WUFDdEIsYUFBYSxFQUFFO2dCQUNYLEtBQUssRUFBRSxJQUFJO2FBQ2Q7WUFDRCxpQkFBaUIsRUFBRSxJQUFJO1lBQ3ZCLFVBQVUsRUFBRTtnQkFDUixLQUFLLEVBQUUsSUFBSTthQUNkO1lBQ0Qsa0JBQWtCLEVBQUU7Z0JBQ2hCLEtBQUssRUFBRTtvQkFDTCxPQUFPLEVBQUUsS0FBSztvQkFDZCxRQUFRLEVBQUUsSUFBSTtpQkFDZjthQUNKO1lBQ0QsWUFBWSxFQUFFO2dCQUNWLEtBQUssRUFBRSxJQUFJO2FBQ2Q7WUFDRCxnQkFBZ0IsRUFBRTtnQkFDZCxZQUFZLEVBQUUsR0FBRyxXQUFXLENBQUMsT0FBTyxrQ0FBa0M7Z0JBQ3RFLFNBQVMsRUFBRSw4QkFBOEIsV0FBVyxDQUFDLE9BQU8sb0NBQW9DO2dCQUNoRyxVQUFVLEVBQUUsT0FBTyxDQUFDLHNCQUFzQixDQUFDLElBQUk7YUFDbEQ7WUFDRCxlQUFlLEVBQUUsT0FBTyxDQUFDLGVBQWUsQ0FBQyxVQUFVO1lBQ25ELGFBQWEsRUFBRSxHQUFHLENBQUMsYUFBYSxDQUFDLE1BQU07U0FDeEMsQ0FBQyxDQUFDO1FBRUwsSUFBSSxVQUFVLEdBQUcsR0FBRyxXQUFXLENBQUMsU0FBUyxZQUFZLENBQUM7UUFDdEQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEVBQUU7WUFDdEMsa0JBQWtCLEVBQUUsVUFBVTtZQUM5QixTQUFTLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLElBQUk7YUFDZDtTQUNKLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQzVCLENBQUM7Q0FDSjtBQS9DRCwwQ0ErQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJztcbmltcG9ydCAqIGFzIGNkayBmcm9tICdhd3MtY2RrLWxpYic7XG5pbXBvcnQgKiBhcyBjb2duaXRvIGZyb20gJ2F3cy1jZGstbGliL2F3cy1jb2duaXRvJztcbmltcG9ydCB7IEJ1aWxkQ29uZmlnIH0gZnJvbSAnLi9idWlsZC1jb25maWcnO1xuICBcbmV4cG9ydCBjbGFzcyBDb2duaXRvVXNlclBvb2wgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gICAgcHVibGljIHJlYWRvbmx5IHVzZXJQb29sOiBjb2duaXRvLlVzZXJQb29sO1xuICAgIHB1YmxpYyByZWFkb25seSBhcHBDbGllbnQ6IGNvZ25pdG8uVXNlclBvb2xDbGllbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBidWlsZENvbmZpZzogQnVpbGRDb25maWcpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGAke2J1aWxkQ29uZmlnLmVudlByZWZpeH1Vc2VyUG9vbGApO1xuICAgICAgICBsZXQgcG9vbE5hbWUgPSBgJHtidWlsZENvbmZpZy5lbnZQcmVmaXh9VXNlclBvb2xgO1xuXG4gICAgICAgIGNvbnN0IHBvb2wgPSBuZXcgY29nbml0by5Vc2VyUG9vbCh0aGlzLCBwb29sTmFtZSAsIHtcbiAgICAgICAgICAgIHVzZXJQb29sTmFtZTogcG9vbE5hbWUsXG4gICAgICAgICAgICBzaWduSW5BbGlhc2VzOiB7XG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZlNpZ25VcEVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICBhdXRvVmVyaWZ5OiB7XG4gICAgICAgICAgICAgICAgZW1haWw6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RhbmRhcmRBdHRyaWJ1dGVzOiB7XG4gICAgICAgICAgICAgICAgZW1haWw6IHtcbiAgICAgICAgICAgICAgICAgIG11dGFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgcmVxdWlyZWQ6IHRydWUsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIH0sICAgICAgICAgICAgXG4gICAgICAgICAgICBrZWVwT3JpZ2luYWw6IHtcbiAgICAgICAgICAgICAgICBlbWFpbDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1c2VyVmVyaWZpY2F0aW9uOiB7XG4gICAgICAgICAgICAgICAgZW1haWxTdWJqZWN0OiBgJHtidWlsZENvbmZpZy5hcHBOYW1lfSB8IFlvdSBuZWVkIHRvIHZlcmlmeSB5b3VyIGVtYWlsYCxcbiAgICAgICAgICAgICAgICBlbWFpbEJvZHk6IGBUaGFua3MgZm9yIHNpZ25pbmcgdXAgd2l0aCAke2J1aWxkQ29uZmlnLmFwcE5hbWV9LiBZb3VyIHZlcmlmaWNhdGlvbiBjb2RlIGlzIHsjIyMjfWAsXG4gICAgICAgICAgICAgICAgZW1haWxTdHlsZTogY29nbml0by5WZXJpZmljYXRpb25FbWFpbFN0eWxlLkNPREUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWNjb3VudFJlY292ZXJ5OiBjb2duaXRvLkFjY291bnRSZWNvdmVyeS5FTUFJTF9PTkxZLFxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuUkVUQUlOLFxuICAgICAgICAgIH0pO1xuXG4gICAgICAgIGxldCBjbGllbnROYW1lID0gYCR7YnVpbGRDb25maWcuZW52UHJlZml4fVVzZXJDbGllbnRgO1xuICAgICAgICBjb25zdCBjbGllbnQgPSBwb29sLmFkZENsaWVudChjbGllbnROYW1lLCB7XG4gICAgICAgICAgICB1c2VyUG9vbENsaWVudE5hbWU6IGNsaWVudE5hbWUsXG4gICAgICAgICAgICBhdXRoRmxvd3M6IHtcbiAgICAgICAgICAgICAgdXNlclNycDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudXNlclBvb2wgPSBwb29sO1xuICAgICAgICB0aGlzLmFwcENsaWVudCA9IGNsaWVudDtcbiAgICB9XG59Il19