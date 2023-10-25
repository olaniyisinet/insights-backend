"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaFunction = void 0;
const constructs_1 = require("constructs");
const lambda = require("aws-cdk-lib/aws-lambda");
const apiGateway = require("aws-cdk-lib/aws-apigateway");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
class LambdaFunction extends constructs_1.Construct {
    constructor(scope, id, props) {
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
                ]
            }),
            handler: `${id}.handler`,
            logRetention: aws_logs_1.RetentionDays.ONE_MONTH,
            environment: props.environment
        });
        const lambdaApiIntegration = new apiGateway.LambdaIntegration(lambdaFunc);
        if (props.httpRelativePath) {
            const lambdaApiResource = props.apiEndpoint.root.addResource(props.httpRelativePath);
            lambdaApiResource.addMethod(props.httpMethod, lambdaApiIntegration);
        }
        else {
            props.apiEndpoint.root.addMethod(props.httpMethod, lambdaApiIntegration);
        }
        this.lambdaFunction = lambdaFunc;
    }
}
exports.LambdaFunction = LambdaFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uc3RydWN0LWxhbWJkYS1mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnN0cnVjdC1sYW1iZGEtZnVuY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsMkNBQXVDO0FBQ3ZDLGlEQUFpRDtBQUNqRCx5REFBeUQ7QUFDekQsbURBQXFEO0FBVXJELE1BQWEsY0FBZSxTQUFRLHNCQUFTO0lBSXpDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBMEI7UUFDaEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQixJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFFdkUsTUFBTSxVQUFVLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLEVBQUU7WUFDN0MsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVztZQUNuQyxJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMseUJBQXlCLEVBQUU7Z0JBQ25ELE9BQU8sRUFBRTtvQkFDTCxJQUFJO29CQUNKLElBQUksRUFBRSxLQUFLO29CQUNYLE9BQU87b0JBQ1AsU0FBUztvQkFDVCxJQUFJLFdBQVcsRUFBRTtvQkFDakIsSUFBSSxXQUFXLElBQUk7aUJBQ3RCO2FBQUMsQ0FBQztZQUNQLE9BQU8sRUFBRSxHQUFHLEVBQUUsVUFBVTtZQUN4QixZQUFZLEVBQUUsd0JBQWEsQ0FBQyxTQUFTO1lBQ3JDLFdBQVcsRUFBRSxLQUFLLENBQUMsV0FBVztTQUNqQyxDQUFDLENBQUM7UUFFSCxNQUFNLG9CQUFvQixHQUFHLElBQUksVUFBVSxDQUFDLGlCQUFpQixDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzFFLElBQUcsS0FBSyxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZCLE1BQU0saUJBQWlCLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3JGLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDLENBQUM7U0FDdkU7YUFBTTtZQUNILEtBQUssQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLG9CQUFvQixDQUFDLENBQUM7U0FDNUU7UUFFRCxJQUFJLENBQUMsY0FBYyxHQUFHLFVBQVUsQ0FBQztJQUNyQyxDQUFDO0NBQ0o7QUFsQ0Qsd0NBa0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSAnY29uc3RydWN0cyc7XG5pbXBvcnQgKiBhcyBsYW1iZGEgZnJvbSAnYXdzLWNkay1saWIvYXdzLWxhbWJkYSc7XG5pbXBvcnQgKiBhcyBhcGlHYXRld2F5IGZyb20gJ2F3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5JztcbmltcG9ydCB7IFJldGVudGlvbkRheXMgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbG9ncyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTGFtYmRhRnVuY3Rpb25Qcm9wcyB7XG4gICAgcmVhZG9ubHkgaHR0cE1ldGhvZDogc3RyaW5nO1xuICAgIHJlYWRvbmx5IGh0dHBSZWxhdGl2ZVBhdGg/OiBzdHJpbmc7XG4gICAgcmVhZG9ubHkgYXBpRW5kcG9pbnQ6ICBhcGlHYXRld2F5LlJlc3RBcGk7XG4gICAgcmVhZG9ubHkgZW52aXJvbm1lbnQ/OiB7IFtrZXk6IHN0cmluZ106IHN0cmluZyB9O1xuICAgIHJlYWRvbmx5IGluY2x1ZGVQYWNrYWdlPzogc3RyaW5nO1xufVxuICBcbmV4cG9ydCBjbGFzcyBMYW1iZGFGdW5jdGlvbiBleHRlbmRzIENvbnN0cnVjdCB7XG5cbiAgICBwdWJsaWMgcmVhZG9ubHkgbGFtYmRhRnVuY3Rpb246IGxhbWJkYS5GdW5jdGlvbjtcblxuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBMYW1iZGFGdW5jdGlvblByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCk7XG4gICAgICAgIGxldCBwYWNrYWdlTmFtZSA9IHByb3BzLmluY2x1ZGVQYWNrYWdlID8gcHJvcHMuaW5jbHVkZVBhY2thZ2UgOiAnbm9uZSc7XG5cbiAgICAgICAgY29uc3QgbGFtYmRhRnVuYyA9IG5ldyBsYW1iZGEuRnVuY3Rpb24odGhpcywgaWQsIHtcbiAgICAgICAgICAgIHJ1bnRpbWU6IGxhbWJkYS5SdW50aW1lLk5PREVKU18xOF9YLCAgIFxuICAgICAgICAgICAgY29kZTogbGFtYmRhLkNvZGUuZnJvbUFzc2V0KCdhc3NldHMvbGFtYmRhLWZ1bmN0aW9ucycsIHsgXG4gICAgICAgICAgICAgICAgZXhjbHVkZTogWyBcbiAgICAgICAgICAgICAgICAgICAgXCIqKlwiLCBcbiAgICAgICAgICAgICAgICAgICAgYCEke2lkfS5qc2AsXG4gICAgICAgICAgICAgICAgICAgIGAhdXRpbGAsXG4gICAgICAgICAgICAgICAgICAgIGAhdXRpbC8qYCxcbiAgICAgICAgICAgICAgICAgICAgYCEke3BhY2thZ2VOYW1lfWAsXG4gICAgICAgICAgICAgICAgICAgIGAhJHtwYWNrYWdlTmFtZX0vKmBcbiAgICAgICAgICAgICAgICBdfSksICBcbiAgICAgICAgICAgIGhhbmRsZXI6IGAke2lkfS5oYW5kbGVyYCxcbiAgICAgICAgICAgIGxvZ1JldGVudGlvbjogUmV0ZW50aW9uRGF5cy5PTkVfTU9OVEgsXG4gICAgICAgICAgICBlbnZpcm9ubWVudDogcHJvcHMuZW52aXJvbm1lbnRcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY29uc3QgbGFtYmRhQXBpSW50ZWdyYXRpb24gPSBuZXcgYXBpR2F0ZXdheS5MYW1iZGFJbnRlZ3JhdGlvbihsYW1iZGFGdW5jKTtcbiAgICAgICAgaWYocHJvcHMuaHR0cFJlbGF0aXZlUGF0aCkge1xuICAgICAgICAgICAgY29uc3QgbGFtYmRhQXBpUmVzb3VyY2UgPSBwcm9wcy5hcGlFbmRwb2ludC5yb290LmFkZFJlc291cmNlKHByb3BzLmh0dHBSZWxhdGl2ZVBhdGgpO1xuICAgICAgICAgICAgbGFtYmRhQXBpUmVzb3VyY2UuYWRkTWV0aG9kKHByb3BzLmh0dHBNZXRob2QsIGxhbWJkYUFwaUludGVncmF0aW9uKTsgXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcm9wcy5hcGlFbmRwb2ludC5yb290LmFkZE1ldGhvZChwcm9wcy5odHRwTWV0aG9kLCBsYW1iZGFBcGlJbnRlZ3JhdGlvbik7IFxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYW1iZGFGdW5jdGlvbiA9IGxhbWJkYUZ1bmM7XG4gICAgfVxufSJdfQ==