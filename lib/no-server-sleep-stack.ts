import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as path from 'path';
import { Construct } from 'constructs';

export class NoServerSleepStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    if (!process.env.ENDPOINT_URL) {
      throw Error("Missing ENDPOINT_URL env var");
    }

    // Lambda function definition
    const noServerSleepFunction = new lambda.Function(this, 'NoServerSleepFunction', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')), // Assumes code in a separate folder
      environment: {
        ENDPOINT_URL: process.env.ENDPOINT_URL, // Replace with your endpoint
      },
    });

    // EventBridge rule to trigger the Lambda function every 10 minutes
    const rule = new events.Rule(this, 'TenMinuteRule', {
      schedule: events.Schedule.rate(cdk.Duration.minutes(10)),
    });

    // Add Lambda as the target of the EventBridge rule
    rule.addTarget(new targets.LambdaFunction(noServerSleepFunction));
  }
}
