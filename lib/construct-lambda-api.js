"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaApi = void 0;
const constructs_1 = require("constructs");
const apiGateway = require("aws-cdk-lib/aws-apigateway");
const construct_lambda_function_1 = require("./construct-lambda-function");
class LambdaApi extends constructs_1.Construct {
    constructor(scope, buildConfig, props) {
        super(scope, '_');
        const apiEndpoint = new apiGateway.RestApi(this, `${buildConfig.envPrefix}BackendApi`, {
            deployOptions: {
                stageName: buildConfig.env,
            },
            defaultCorsPreflightOptions: {
                allowOrigins: apiGateway.Cors.ALL_ORIGINS,
                allowMethods: apiGateway.Cors.ALL_METHODS
            }
        });
        const echoGetGreeting = new construct_lambda_function_1.LambdaFunction(this, 'echoGetGreeting', {
            httpMethod: 'GET',
            apiEndpoint: apiEndpoint,
        });
        const echoGetMessage = new construct_lambda_function_1.LambdaFunction(this, 'echoGetMessage', {
            httpMethod: 'GET',
            httpRelativePath: 'echo-get',
            apiEndpoint: apiEndpoint,
        });
        const echoPostMessage = new construct_lambda_function_1.LambdaFunction(this, 'echoPostMessage', {
            httpMethod: 'POST',
            httpRelativePath: 'echo-post',
            apiEndpoint: apiEndpoint,
        });
        const userInitialSetup = new construct_lambda_function_1.LambdaFunction(this, 'userInitialSetup', {
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
        const userLoadProfile = new construct_lambda_function_1.LambdaFunction(this, 'userLoadProfile', {
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
        const graphByName = new construct_lambda_function_1.LambdaFunction(this, 'graphByName', {
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
exports.LambdaApi = LambdaApi;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0LWxhbWJkYS1hcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25zdHJ1Y3QtbGFtYmRhLWFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwyQ0FBdUM7QUFDdkMseURBQXlEO0FBRXpELDJFQUE2RDtBQVc3RCxNQUFhLFNBQVUsU0FBUSxzQkFBUztJQUlwQyxZQUFZLEtBQWdCLEVBQUUsV0FBd0IsRUFBRyxLQUFxQjtRQUMxRSxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBRWxCLE1BQU0sV0FBVyxHQUFHLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUcsR0FBRyxXQUFXLENBQUMsU0FBUyxZQUFZLEVBQUU7WUFDcEYsYUFBYSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxXQUFXLENBQUMsR0FBRzthQUMzQjtZQUNELDJCQUEyQixFQUFFO2dCQUN6QixZQUFZLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO2dCQUN6QyxZQUFZLEVBQUUsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFXO2FBQzVDO1NBQ0osQ0FBQyxDQUFDO1FBRUgsTUFBTSxlQUFlLEdBQUcsSUFBSSwwQ0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNoRSxVQUFVLEVBQUUsS0FBSztZQUNqQixXQUFXLEVBQUUsV0FBVztTQUMzQixDQUFDLENBQUM7UUFFSCxNQUFNLGNBQWMsR0FBRyxJQUFJLDBDQUFjLENBQUMsSUFBSSxFQUFFLGdCQUFnQixFQUFFO1lBQzlELFVBQVUsRUFBRSxLQUFLO1lBQ2pCLGdCQUFnQixFQUFFLFVBQVU7WUFDNUIsV0FBVyxFQUFFLFdBQVc7U0FDM0IsQ0FBQyxDQUFDO1FBRUgsTUFBTSxlQUFlLEdBQUcsSUFBSSwwQ0FBYyxDQUFDLElBQUksRUFBRSxpQkFBaUIsRUFBRTtZQUNoRSxVQUFVLEVBQUUsTUFBTTtZQUNsQixnQkFBZ0IsRUFBRSxXQUFXO1lBQzdCLFdBQVcsRUFBRSxXQUFXO1NBQzNCLENBQUMsQ0FBQztRQUVILE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSwwQ0FBYyxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUNsRSxVQUFVLEVBQUUsTUFBTTtZQUNsQixnQkFBZ0IsRUFBRSxvQkFBb0I7WUFDdEMsV0FBVyxFQUFFLFdBQVc7WUFDeEIsV0FBVyxFQUFFO2dCQUNULGVBQWUsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUztnQkFDakQsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFNBQVM7YUFDdkQ7U0FDSixDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pGLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTdFLE1BQU0sZUFBZSxHQUFHLElBQUksMENBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUU7WUFDaEUsVUFBVSxFQUFFLE1BQU07WUFDbEIsZ0JBQWdCLEVBQUUsbUJBQW1CO1lBQ3JDLFdBQVcsRUFBRSxXQUFXO1lBQ3hCLFdBQVcsRUFBRTtnQkFDVCxlQUFlLEVBQUUsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFNBQVM7Z0JBQ2pELGlCQUFpQixFQUFFLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTO2FBQ3ZEO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEYsS0FBSyxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBRTVFLE1BQU0sV0FBVyxHQUFHLElBQUksMENBQWMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3hELFVBQVUsRUFBRSxNQUFNO1lBQ2xCLGdCQUFnQixFQUFFLGVBQWU7WUFDakMsV0FBVyxFQUFFLFdBQVc7WUFDeEIsY0FBYyxFQUFFLE9BQU87WUFDdkIsV0FBVyxFQUFFO2dCQUNULGVBQWUsRUFBRSxLQUFLLENBQUMsZ0JBQWdCLENBQUMsU0FBUztnQkFDakQsaUJBQWlCLEVBQUUsS0FBSyxDQUFDLGlCQUFpQixDQUFDLFNBQVM7YUFDdkQ7U0FDSixDQUFDLENBQUM7UUFDSCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1RSxLQUFLLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7UUFFeEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7SUFDbkMsQ0FBQztDQUNKO0FBekVELDhCQXlFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0ICogYXMgYXBpR2F0ZXdheSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheSc7XG5pbXBvcnQgeyBCdWlsZENvbmZpZyB9IGZyb20gJy4vYnVpbGQtY29uZmlnJztcbmltcG9ydCB7IExhbWJkYUZ1bmN0aW9uIH0gZnJvbSAnLi9jb25zdHJ1Y3QtbGFtYmRhLWZ1bmN0aW9uJztcbmltcG9ydCB7IER5bmFtb1VzZXJUYWJsZSB9IGZyb20gJy4vY29uc3RydWN0LWR5bmFtb2RiLXVzZXInO1xuaW1wb3J0IHsgRHluYW1vVGVuYW50VGFibGUgfSBmcm9tICcuL2NvbnN0cnVjdC1keW5hbW9kYi10ZW5hbnQnO1xuaW1wb3J0IHsgQ29nbml0b1VzZXJQb29sIH0gZnJvbSAnLi9jb25zdHJ1Y3QtY29nbml0by1wb29sJztcblxuZXhwb3J0IGludGVyZmFjZSBMYW1iZGFBcGlQcm9wcyB7XG4gICAgcmVhZG9ubHkgdXNlclBvb2w6IENvZ25pdG9Vc2VyUG9vbDtcbiAgICByZWFkb25seSBkeW5hbW9Vc2Vyc1RhYmxlOiBEeW5hbW9Vc2VyVGFibGU7XG4gICAgcmVhZG9ubHkgZHluYW1vVGVuYW50VGFibGU6IER5bmFtb1RlbmFudFRhYmxlO1xufVxuICBcbmV4cG9ydCBjbGFzcyBMYW1iZGFBcGkgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gICAgcHVibGljIHJlYWRvbmx5IGFwaUVuZHBvaW50OiBhcGlHYXRld2F5LlJlc3RBcGk7XG5cbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBidWlsZENvbmZpZzogQnVpbGRDb25maWcsICBwcm9wczogTGFtYmRhQXBpUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsICdfJyk7XG5cbiAgICAgICAgY29uc3QgYXBpRW5kcG9pbnQgPSBuZXcgYXBpR2F0ZXdheS5SZXN0QXBpKHRoaXMsICBgJHtidWlsZENvbmZpZy5lbnZQcmVmaXh9QmFja2VuZEFwaWAsIHtcbiAgICAgICAgICAgIGRlcGxveU9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgc3RhZ2VOYW1lOiBidWlsZENvbmZpZy5lbnYsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgYWxsb3dPcmlnaW5zOiBhcGlHYXRld2F5LkNvcnMuQUxMX09SSUdJTlMsXG4gICAgICAgICAgICAgICAgYWxsb3dNZXRob2RzOiBhcGlHYXRld2F5LkNvcnMuQUxMX01FVEhPRFNcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgZWNob0dldEdyZWV0aW5nID0gbmV3IExhbWJkYUZ1bmN0aW9uKHRoaXMsICdlY2hvR2V0R3JlZXRpbmcnLCB7XG4gICAgICAgICAgICBodHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGFwaUVuZHBvaW50OiBhcGlFbmRwb2ludCxcbiAgICAgICAgfSk7IFxuICAgIFxuICAgICAgICBjb25zdCBlY2hvR2V0TWVzc2FnZSA9IG5ldyBMYW1iZGFGdW5jdGlvbih0aGlzLCAnZWNob0dldE1lc3NhZ2UnLCB7XG4gICAgICAgICAgICBodHRwTWV0aG9kOiAnR0VUJyxcbiAgICAgICAgICAgIGh0dHBSZWxhdGl2ZVBhdGg6ICdlY2hvLWdldCcsXG4gICAgICAgICAgICBhcGlFbmRwb2ludDogYXBpRW5kcG9pbnQsXG4gICAgICAgIH0pOyBcbiAgICBcbiAgICAgICAgY29uc3QgZWNob1Bvc3RNZXNzYWdlID0gbmV3IExhbWJkYUZ1bmN0aW9uKHRoaXMsICdlY2hvUG9zdE1lc3NhZ2UnLCB7XG4gICAgICAgICAgICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBodHRwUmVsYXRpdmVQYXRoOiAnZWNoby1wb3N0JyxcbiAgICAgICAgICAgIGFwaUVuZHBvaW50OiBhcGlFbmRwb2ludCxcbiAgICAgICAgfSk7IFxuICAgIFxuICAgICAgICBjb25zdCB1c2VySW5pdGlhbFNldHVwID0gbmV3IExhbWJkYUZ1bmN0aW9uKHRoaXMsICd1c2VySW5pdGlhbFNldHVwJywge1xuICAgICAgICAgICAgaHR0cE1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgaHR0cFJlbGF0aXZlUGF0aDogJ3VzZXItaW5pdGlhbC1zZXR1cCcsXG4gICAgICAgICAgICBhcGlFbmRwb2ludDogYXBpRW5kcG9pbnQsXG4gICAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgICAgIFVTRVJfVEFCTEVfTkFNRTogcHJvcHMuZHluYW1vVXNlcnNUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgICAgICAgICAgVEVOQU5UX1RBQkxFX05BTUU6IHByb3BzLmR5bmFtb1RlbmFudFRhYmxlLnRhYmxlTmFtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgXG4gICAgICAgIHByb3BzLmR5bmFtb1VzZXJzVGFibGUudGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHVzZXJJbml0aWFsU2V0dXAubGFtYmRhRnVuY3Rpb24pO1xuICAgICAgICBwcm9wcy5keW5hbW9UZW5hbnRUYWJsZS50YWJsZS5ncmFudFJlYWREYXRhKHVzZXJJbml0aWFsU2V0dXAubGFtYmRhRnVuY3Rpb24pO1xuICAgIFxuICAgICAgICBjb25zdCB1c2VyTG9hZFByb2ZpbGUgPSBuZXcgTGFtYmRhRnVuY3Rpb24odGhpcywgJ3VzZXJMb2FkUHJvZmlsZScsIHtcbiAgICAgICAgICAgIGh0dHBNZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICAgIGh0dHBSZWxhdGl2ZVBhdGg6ICd1c2VyLWxvYWQtcHJvZmlsZScsXG4gICAgICAgICAgICBhcGlFbmRwb2ludDogYXBpRW5kcG9pbnQsXG4gICAgICAgICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICAgICAgICAgIFVTRVJfVEFCTEVfTkFNRTogcHJvcHMuZHluYW1vVXNlcnNUYWJsZS50YWJsZU5hbWUsXG4gICAgICAgICAgICAgICAgVEVOQU5UX1RBQkxFX05BTUU6IHByb3BzLmR5bmFtb1RlbmFudFRhYmxlLnRhYmxlTmFtZVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTsgXG4gICAgICAgIHByb3BzLmR5bmFtb1VzZXJzVGFibGUudGFibGUuZ3JhbnRSZWFkV3JpdGVEYXRhKHVzZXJMb2FkUHJvZmlsZS5sYW1iZGFGdW5jdGlvbik7XG4gICAgICAgIHByb3BzLmR5bmFtb1RlbmFudFRhYmxlLnRhYmxlLmdyYW50UmVhZERhdGEodXNlckxvYWRQcm9maWxlLmxhbWJkYUZ1bmN0aW9uKTtcblxuICAgICAgICBjb25zdCBncmFwaEJ5TmFtZSA9IG5ldyBMYW1iZGFGdW5jdGlvbih0aGlzLCAnZ3JhcGhCeU5hbWUnLCB7XG4gICAgICAgICAgICBodHRwTWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICBodHRwUmVsYXRpdmVQYXRoOiAnZ3JhcGgtYnktbmFtZScsXG4gICAgICAgICAgICBhcGlFbmRwb2ludDogYXBpRW5kcG9pbnQsXG4gICAgICAgICAgICBpbmNsdWRlUGFja2FnZTogJ2dyYXBoJyxcbiAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgVVNFUl9UQUJMRV9OQU1FOiBwcm9wcy5keW5hbW9Vc2Vyc1RhYmxlLnRhYmxlTmFtZSxcbiAgICAgICAgICAgICAgICBURU5BTlRfVEFCTEVfTkFNRTogcHJvcHMuZHluYW1vVGVuYW50VGFibGUudGFibGVOYW1lXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pOyBcbiAgICAgICAgcHJvcHMuZHluYW1vVXNlcnNUYWJsZS50YWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZ3JhcGhCeU5hbWUubGFtYmRhRnVuY3Rpb24pO1xuICAgICAgICBwcm9wcy5keW5hbW9UZW5hbnRUYWJsZS50YWJsZS5ncmFudFJlYWREYXRhKGdyYXBoQnlOYW1lLmxhbWJkYUZ1bmN0aW9uKTtcblxuICAgICAgICB0aGlzLmFwaUVuZHBvaW50ID0gYXBpRW5kcG9pbnQ7XG4gICAgfVxufSJdfQ==