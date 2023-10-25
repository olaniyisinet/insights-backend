import * as cdk from "aws-cdk-lib";
declare const supportedEnvironments: readonly ["dev", "prod", "test"];
type SupportedEnvironment = typeof supportedEnvironments[number];
export interface BuildConfig {
    readonly env: SupportedEnvironment;
    readonly region: string;
    readonly envPrefix: string;
    readonly appName: string;
    readonly awsAccountId: string;
    readonly pipelineMode: boolean;
}
export declare const getConfig: (app: cdk.App) => BuildConfig;
export declare const getConfigByEnv: (environment: SupportedEnvironment, app: cdk.App) => BuildConfig;
export {};
