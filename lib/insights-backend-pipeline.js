"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsightsBackendPipeline = void 0;
const cdk = require("aws-cdk-lib");
const pipelines_1 = require("aws-cdk-lib/pipelines");
const build_config_1 = require("./build-config");
const insights_backend_stage_1 = require("./insights-backend-stage");
class InsightsBackendPipeline extends cdk.Stack {
    constructor(app, pipelineName, props) {
        super(app, pipelineName, props);
        //Create code pipeline artifact bucket
        /*const artifactBucket = new s3.Bucket(this, 'artifactBucket', {
            versioned: false,
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL
        });*/
        //Create code pipeline
        const pipeline = new pipelines_1.CodePipeline(this, pipelineName, {
            pipelineName: pipelineName,
            synth: new pipelines_1.ShellStep('Synth', {
                input: pipelines_1.CodePipelineSource.gitHub('RE-24-com/insights-backend', 'prod-v1', {
                    authentication: cdk.SecretValue.secretsManager('github-token', {
                        jsonField: 'github-token'
                    })
                }),
                commands: ['npm ci', 'npm install -g aws-cdk', 'cdk synth -c pipeline=true', 'npm run build']
            }),
            dockerEnabledForSynth: true
        });
        // Test envioranment deployment
        const testBuildConfig = (0, build_config_1.getConfigByEnv)("test", app);
        const testStageId = 'TestEnvStage';
        const testStage = pipeline.addStage(new insights_backend_stage_1.InsightsBackendStage(this, testStageId, testBuildConfig, props));
        // Add manual aproval before prod
        testStage.addPost(new pipelines_1.ManualApprovalStep('Manual Approval Before Production'));
        // Production envioranment eployment
        const prodBuildConfig = (0, build_config_1.getConfigByEnv)("prod", app);
        const prodStageId = 'ProdEnvStage';
        const prodStage = pipeline.addStage(new insights_backend_stage_1.InsightsBackendStage(this, prodStageId, prodBuildConfig, props));
    }
}
exports.InsightsBackendPipeline = InsightsBackendPipeline;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zaWdodHMtYmFja2VuZC1waXBlbGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImluc2lnaHRzLWJhY2tlbmQtcGlwZWxpbmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsbUNBQW1DO0FBQ25DLHFEQUF3RztBQUN4RyxpREFBZ0Q7QUFDaEQscUVBQWdFO0FBR2hFLE1BQWEsdUJBQXdCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDbEQsWUFBWSxHQUFZLEVBQUUsWUFBb0IsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsR0FBRyxFQUFFLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVoQyxzQ0FBc0M7UUFDdEM7Ozs7O2FBS0s7UUFFTCxzQkFBc0I7UUFDdEIsTUFBTSxRQUFRLEdBQUcsSUFBSSx3QkFBWSxDQUFDLElBQUksRUFBRSxZQUFZLEVBQUU7WUFDbEQsWUFBWSxFQUFFLFlBQVk7WUFDMUIsS0FBSyxFQUFFLElBQUkscUJBQVMsQ0FBQyxPQUFPLEVBQUU7Z0JBQzFCLEtBQUssRUFBRSw4QkFBa0IsQ0FBQyxNQUFNLENBQUMsNEJBQTRCLEVBQUUsU0FBUyxFQUFFO29CQUN0RSxjQUFjLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsY0FBYyxFQUFFO3dCQUMzRCxTQUFTLEVBQUUsY0FBYztxQkFDMUIsQ0FBQztpQkFDUCxDQUFDO2dCQUNGLFFBQVEsRUFBRSxDQUFDLFFBQVEsRUFBRSx3QkFBd0IsRUFBRSw0QkFBNEIsRUFBRSxlQUFlLENBQUM7YUFDaEcsQ0FDQTtZQUNELHFCQUFxQixFQUFFLElBQUk7U0FDOUIsQ0FBQyxDQUFDO1FBRUgsK0JBQStCO1FBQy9CLE1BQU0sZUFBZSxHQUFHLElBQUEsNkJBQWMsRUFBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDcEQsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDO1FBQ25DLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSw2Q0FBb0IsQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBRXpHLGlDQUFpQztRQUNqQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksOEJBQWtCLENBQUMsbUNBQW1DLENBQUMsQ0FBQyxDQUFDO1FBRS9FLG9DQUFvQztRQUNwQyxNQUFNLGVBQWUsR0FBRyxJQUFBLDZCQUFjLEVBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3BELE1BQU0sV0FBVyxHQUFHLGNBQWMsQ0FBQztRQUNuQyxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksNkNBQW9CLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUM3RyxDQUFDO0NBQ0o7QUF4Q0QsMERBd0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvZGVQaXBlbGluZSwgQ29kZVBpcGVsaW5lU291cmNlLCBTaGVsbFN0ZXAsIE1hbnVhbEFwcHJvdmFsU3RlcCB9IGZyb20gJ2F3cy1jZGstbGliL3BpcGVsaW5lcyc7XG5pbXBvcnQgeyBnZXRDb25maWdCeUVudiB9IGZyb20gJy4vYnVpbGQtY29uZmlnJztcbmltcG9ydCB7IEluc2lnaHRzQmFja2VuZFN0YWdlIH0gZnJvbSAnLi9pbnNpZ2h0cy1iYWNrZW5kLXN0YWdlJztcblxuXG5leHBvcnQgY2xhc3MgSW5zaWdodHNCYWNrZW5kUGlwZWxpbmUgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgIGNvbnN0cnVjdG9yKGFwcDogY2RrLkFwcCwgcGlwZWxpbmVOYW1lOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoYXBwLCBwaXBlbGluZU5hbWUsIHByb3BzKTtcblxuICAgICAgICAvL0NyZWF0ZSBjb2RlIHBpcGVsaW5lIGFydGlmYWN0IGJ1Y2tldFxuICAgICAgICAvKmNvbnN0IGFydGlmYWN0QnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCAnYXJ0aWZhY3RCdWNrZXQnLCB7XG4gICAgICAgICAgICB2ZXJzaW9uZWQ6IGZhbHNlLFxuICAgICAgICAgICAgcmVtb3ZhbFBvbGljeTogY2RrLlJlbW92YWxQb2xpY3kuREVTVFJPWSxcbiAgICAgICAgICAgIGF1dG9EZWxldGVPYmplY3RzOiB0cnVlLFxuICAgICAgICAgICAgYmxvY2tQdWJsaWNBY2Nlc3M6IHMzLkJsb2NrUHVibGljQWNjZXNzLkJMT0NLX0FMTFxuICAgICAgICB9KTsqL1xuXG4gICAgICAgIC8vQ3JlYXRlIGNvZGUgcGlwZWxpbmVcbiAgICAgICAgY29uc3QgcGlwZWxpbmUgPSBuZXcgQ29kZVBpcGVsaW5lKHRoaXMsIHBpcGVsaW5lTmFtZSwge1xuICAgICAgICAgICAgcGlwZWxpbmVOYW1lOiBwaXBlbGluZU5hbWUsXG4gICAgICAgICAgICBzeW50aDogbmV3IFNoZWxsU3RlcCgnU3ludGgnLCB7XG4gICAgICAgICAgICAgICAgaW5wdXQ6IENvZGVQaXBlbGluZVNvdXJjZS5naXRIdWIoJ1JFLTI0LWNvbS9pbnNpZ2h0cy1iYWNrZW5kJywgJ3Byb2QtdjEnLCB7XG4gICAgICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uOiBjZGsuU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2dpdGh1Yi10b2tlbicsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGpzb25GaWVsZDogJ2dpdGh1Yi10b2tlbidcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIGNvbW1hbmRzOiBbJ25wbSBjaScsICducG0gaW5zdGFsbCAtZyBhd3MtY2RrJywgJ2NkayBzeW50aCAtYyBwaXBlbGluZT10cnVlJywgJ25wbSBydW4gYnVpbGQnXVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIGRvY2tlckVuYWJsZWRGb3JTeW50aDogdHJ1ZVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBUZXN0IGVudmlvcmFubWVudCBkZXBsb3ltZW50XG4gICAgICAgIGNvbnN0IHRlc3RCdWlsZENvbmZpZyA9IGdldENvbmZpZ0J5RW52KFwidGVzdFwiLCBhcHApO1xuICAgICAgICBjb25zdCB0ZXN0U3RhZ2VJZCA9ICdUZXN0RW52U3RhZ2UnO1xuICAgICAgICBjb25zdCB0ZXN0U3RhZ2UgPSBwaXBlbGluZS5hZGRTdGFnZShuZXcgSW5zaWdodHNCYWNrZW5kU3RhZ2UodGhpcywgdGVzdFN0YWdlSWQsIHRlc3RCdWlsZENvbmZpZywgcHJvcHMpKTtcblxuICAgICAgICAvLyBBZGQgbWFudWFsIGFwcm92YWwgYmVmb3JlIHByb2RcbiAgICAgICAgdGVzdFN0YWdlLmFkZFBvc3QobmV3IE1hbnVhbEFwcHJvdmFsU3RlcCgnTWFudWFsIEFwcHJvdmFsIEJlZm9yZSBQcm9kdWN0aW9uJykpO1xuXG4gICAgICAgIC8vIFByb2R1Y3Rpb24gZW52aW9yYW5tZW50IGVwbG95bWVudFxuICAgICAgICBjb25zdCBwcm9kQnVpbGRDb25maWcgPSBnZXRDb25maWdCeUVudihcInByb2RcIiwgYXBwKTtcbiAgICAgICAgY29uc3QgcHJvZFN0YWdlSWQgPSAnUHJvZEVudlN0YWdlJztcbiAgICAgICAgY29uc3QgcHJvZFN0YWdlID0gcGlwZWxpbmUuYWRkU3RhZ2UobmV3IEluc2lnaHRzQmFja2VuZFN0YWdlKHRoaXMsIHByb2RTdGFnZUlkLCBwcm9kQnVpbGRDb25maWcsIHByb3BzKSk7XG4gICAgfVxufSJdfQ==