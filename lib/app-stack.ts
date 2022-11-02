import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 아래 내용을 추가합니다
    const fn = new lambda.Function(this, 'LambdaFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('lambda/')
    });
    
		// Agent Layer 추가
    const agentArn = 'arn:aws:lambda:ap-northeast-1:800880067056:layer:CloudOne-ApplicationSecurity-nodejs14_x:1';
    const agentLayer = lambda.LayerVersion.fromLayerVersionArn(this, 'TrendMicroAgent', agentArn);
    fn.addLayers(agentLayer)
    
    // 환경 변수 추가
    fn.addEnvironment('AWS_LAMBDA_EXEC_WRAPPER', '/opt/trend_app_protect');
    fn.addEnvironment('TREND_AP_HELLO_URL', 'https://agents.jp-1.application.cloudone.trendmicro.com/');
    fn.addEnvironment('TREND_AP_KEY', 'bedb1636-71ed-4826-9117-b6133e355055');
    fn.addEnvironment('TREND_AP_SECRET', '8a736896-6def-4bec-8c67-a6a546a80bc0');
  }
}