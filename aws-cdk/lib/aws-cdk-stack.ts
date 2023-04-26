// import * as cdk from "aws-cdk-lib";
import * as cdk from "@aws-cdk/core";
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigw from "@aws-cdk/aws-apigateway";

export class AwsCdkStack extends cdk.Stack {
	constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		// create a new lambda function
		const lambdaFunction = new lambda.Function(this, "MyLambdaFunction", {
			runtime: lambda.Runtime.NODEJS_16_X,
			handler: "index.handler",
			code: lambda.Code.fromAsset("lambda"),
		});

		// create a new API Gateway HTTP API
		const httpApi = new apigw.LambdaRestApi(this, "MyHttpApi", {
			handler: lambdaFunction,
		});
		// const lambdaFunction2 = new apigw.CfnOutput(this, "ApiEndpoint", {
		// 	value: httpApi.url!,
		// });
		console.log(httpApi.url);
	}
}
