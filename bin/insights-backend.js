#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const insights_backend_stack_1 = require("../lib/insights-backend-stack");
const insights_backend_pipeline_1 = require("../lib/insights-backend-pipeline");
const build_config_1 = require("../lib/build-config");
const app = new cdk.App();
const buildConfig = (0, build_config_1.getConfig)(app);
if (buildConfig.pipelineMode) {
    // production and test environments getting created thought the pipeline
    // So, prifixing the pipeline as 'Prod'
    // run the pieline mode via [cdk deploy/destroy -c pipeline=true]
    const pipelineName = 'ProdInsightsBackendPipeline';
    new insights_backend_pipeline_1.InsightsBackendPipeline(app, pipelineName, {
        env: {
            account: buildConfig.awsAccountId,
            region: buildConfig.region
        }
    });
    app.synth();
}
else {
    // if not piepline mode then create the corresponding environment manually
    const stackId = `${buildConfig.envPrefix}BackendStack`;
    new insights_backend_stack_1.InsightsBackendStack(app, stackId, buildConfig, {
        stackName: stackId,
        env: {
            account: buildConfig.awsAccountId,
            region: buildConfig.region
        }
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zaWdodHMtYmFja2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc2lnaHRzLWJhY2tlbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsbUNBQW1DO0FBQ25DLDBFQUFxRTtBQUNyRSxnRkFBeUU7QUFDekUsc0RBQWdEO0FBRWhELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFCLE1BQU0sV0FBVyxHQUFHLElBQUEsd0JBQVMsRUFBQyxHQUFHLENBQUMsQ0FBQztBQUVuQyxJQUFJLFdBQVcsQ0FBQyxZQUFZLEVBQUU7SUFDMUIsd0VBQXdFO0lBQ3hFLHVDQUF1QztJQUN2QyxpRUFBaUU7SUFDakUsTUFBTSxZQUFZLEdBQUcsNkJBQTZCLENBQUM7SUFDbkQsSUFBSSxtREFBdUIsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFO1FBQzdDLEdBQUcsRUFBRTtZQUNILE9BQU8sRUFBRSxXQUFXLENBQUMsWUFBWTtZQUNqQyxNQUFNLEVBQUUsV0FBVyxDQUFDLE1BQU07U0FDM0I7S0FDRixDQUFDLENBQUM7SUFFSCxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7Q0FFZjtLQUFNO0lBQ0gsMEVBQTBFO0lBQzFFLE1BQU0sT0FBTyxHQUFHLEdBQUcsV0FBVyxDQUFDLFNBQVMsY0FBYyxDQUFDO0lBQ3ZELElBQUksNkNBQW9CLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRyxXQUFXLEVBQUU7UUFDakQsU0FBUyxFQUFFLE9BQU87UUFDbEIsR0FBRyxFQUFFO1lBQ0QsT0FBTyxFQUFFLFdBQVcsQ0FBQyxZQUFZO1lBQ2pDLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTTtTQUM3QjtLQUNKLENBQUMsQ0FBQztDQUNOIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEluc2lnaHRzQmFja2VuZFN0YWNrIH0gZnJvbSAnLi4vbGliL2luc2lnaHRzLWJhY2tlbmQtc3RhY2snO1xuaW1wb3J0IHtJbnNpZ2h0c0JhY2tlbmRQaXBlbGluZX0gZnJvbSAnLi4vbGliL2luc2lnaHRzLWJhY2tlbmQtcGlwZWxpbmUnO1xuaW1wb3J0IHsgZ2V0Q29uZmlnIH0gZnJvbSAnLi4vbGliL2J1aWxkLWNvbmZpZyc7XG5cbmNvbnN0IGFwcCA9IG5ldyBjZGsuQXBwKCk7XG5jb25zdCBidWlsZENvbmZpZyA9IGdldENvbmZpZyhhcHApO1xuXG5pZiAoYnVpbGRDb25maWcucGlwZWxpbmVNb2RlKSB7XG4gICAgLy8gcHJvZHVjdGlvbiBhbmQgdGVzdCBlbnZpcm9ubWVudHMgZ2V0dGluZyBjcmVhdGVkIHRob3VnaHQgdGhlIHBpcGVsaW5lXG4gICAgLy8gU28sIHByaWZpeGluZyB0aGUgcGlwZWxpbmUgYXMgJ1Byb2QnXG4gICAgLy8gcnVuIHRoZSBwaWVsaW5lIG1vZGUgdmlhIFtjZGsgZGVwbG95L2Rlc3Ryb3kgLWMgcGlwZWxpbmU9dHJ1ZV1cbiAgICBjb25zdCBwaXBlbGluZU5hbWUgPSAnUHJvZEluc2lnaHRzQmFja2VuZFBpcGVsaW5lJztcbiAgICBuZXcgSW5zaWdodHNCYWNrZW5kUGlwZWxpbmUoYXBwLCBwaXBlbGluZU5hbWUsIHtcbiAgICAgIGVudjoge1xuICAgICAgICBhY2NvdW50OiBidWlsZENvbmZpZy5hd3NBY2NvdW50SWQsXG4gICAgICAgIHJlZ2lvbjogYnVpbGRDb25maWcucmVnaW9uXG4gICAgICB9XG4gICAgfSk7XG4gIFxuICAgIGFwcC5zeW50aCgpO1xuICBcbn0gZWxzZSB7XG4gICAgLy8gaWYgbm90IHBpZXBsaW5lIG1vZGUgdGhlbiBjcmVhdGUgdGhlIGNvcnJlc3BvbmRpbmcgZW52aXJvbm1lbnQgbWFudWFsbHlcbiAgICBjb25zdCBzdGFja0lkID0gYCR7YnVpbGRDb25maWcuZW52UHJlZml4fUJhY2tlbmRTdGFja2A7XG4gICAgbmV3IEluc2lnaHRzQmFja2VuZFN0YWNrKGFwcCwgc3RhY2tJZCAsIGJ1aWxkQ29uZmlnLCB7XG4gICAgICAgIHN0YWNrTmFtZTogc3RhY2tJZCxcbiAgICAgICAgZW52OiB7XG4gICAgICAgICAgICBhY2NvdW50OiBidWlsZENvbmZpZy5hd3NBY2NvdW50SWQsXG4gICAgICAgICAgICByZWdpb246IGJ1aWxkQ29uZmlnLnJlZ2lvblxuICAgICAgICB9XG4gICAgfSk7XG59XG4iXX0=