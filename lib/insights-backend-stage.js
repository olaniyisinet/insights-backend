"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsBackendStage = void 0;
const cdk = require("aws-cdk-lib");
const insights_backend_stack_1 = require("./insights-backend-stack");
class InsightsBackendStage extends cdk.Stage {
    constructor(scope, id, buildConfig, props) {
        super(scope, id, props);
        const stackId = `${buildConfig.envPrefix}BackendStack`;
        new insights_backend_stack_1.InsightsBackendStack(this, stackId, buildConfig, {
            stackName: stackId,
            env: {
                account: buildConfig.awsAccountId,
                region: buildConfig.region
            }
        });
    }
}
exports.InsightsBackendStage = InsightsBackendStage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zaWdodHMtYmFja2VuZC1zdGFnZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc2lnaHRzLWJhY2tlbmQtc3RhZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBRW5DLHFFQUFnRTtBQUloRSxNQUFhLG9CQUFxQixTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBRS9DLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsV0FBd0IsRUFBRSxLQUFzQjtRQUN0RixLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUN4QixNQUFNLE9BQU8sR0FBRyxHQUFHLFdBQVcsQ0FBQyxTQUFTLGNBQWMsQ0FBQztRQUN2RCxJQUFJLDZDQUFvQixDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO1lBQ2pELFNBQVMsRUFBRSxPQUFPO1lBQ2xCLEdBQUcsRUFBRTtnQkFDRCxPQUFPLEVBQUUsV0FBVyxDQUFDLFlBQVk7Z0JBQ2pDLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTTthQUM3QjtTQUNKLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQWJELG9EQWFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5pbXBvcnQgeyBJbnNpZ2h0c0JhY2tlbmRTdGFjayB9IGZyb20gJy4vaW5zaWdodHMtYmFja2VuZC1zdGFjayc7XG5pbXBvcnQgeyBCdWlsZENvbmZpZyB9IGZyb20gJy4vYnVpbGQtY29uZmlnJztcblxuXG5leHBvcnQgY2xhc3MgSW5zaWdodHNCYWNrZW5kU3RhZ2UgZXh0ZW5kcyBjZGsuU3RhZ2Uge1xuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgYnVpbGRDb25maWc6IEJ1aWxkQ29uZmlnLCBwcm9wcz86IGNkay5TdGFnZVByb3BzKSB7XG4gICAgICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuICAgICAgICBjb25zdCBzdGFja0lkID0gYCR7YnVpbGRDb25maWcuZW52UHJlZml4fUJhY2tlbmRTdGFja2A7XG4gICAgICAgIG5ldyBJbnNpZ2h0c0JhY2tlbmRTdGFjayh0aGlzLCBzdGFja0lkLCBidWlsZENvbmZpZywge1xuICAgICAgICAgICAgc3RhY2tOYW1lOiBzdGFja0lkLFxuICAgICAgICAgICAgZW52OiB7XG4gICAgICAgICAgICAgICAgYWNjb3VudDogYnVpbGRDb25maWcuYXdzQWNjb3VudElkLFxuICAgICAgICAgICAgICAgIHJlZ2lvbjogYnVpbGRDb25maWcucmVnaW9uXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=