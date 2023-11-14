import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import * as wafv2 from '@aws-cdk/aws-wafv2';
import * as s3 from '@aws-cdk/aws-s3';
import * as cognito from '@aws-cdk/aws-cognito';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';

export class MyStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC y subredes
    const vpc = new ec2.Vpc(this, 'MyVPC', {
      cidr: '10.0.0.0/16'
    });

    const subnetA = new ec2.Subnet(this, 'SubnetA', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.1.0/24',
      availabilityZone: 'us-east-1a'
    });

    const subnetB = new ec2.Subnet(this, 'SubnetB', {
      vpcId: vpc.vpcId,
      cidrBlock: '10.0.2.0/24',
      availabilityZone: 'us-east-1b'
    });

    // RDS
    const myDBSecurityGroup = new ec2.SecurityGroup(this, 'MyDBSecurityGroup', {
      vpc,
      description: 'RDS security group',
      allowAllOutbound: true
    });
    myDBSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3306));

    const myDBSubnetGroup = new rds.SubnetGroup(this, 'MyDBSubnetGroup', {
      description: 'Subnet group for RDS',
      vpc,
      vpcSubnets: {
        subnets: [subnetA, subnetB]
      }
    });

    const dbInstance = new rds.DatabaseInstance(this, 'MyDBInstance', {
      engine: rds.DatabaseInstanceEngine.mysql({ version: rds.MysqlEngineVersion.VER_8_0_19 }),
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      masterUsername: 'admin',
      masterUserPassword: cdk.SecretValue.plainText('password'),
      vpc,
      securityGroups: [myDBSecurityGroup],
      subnetGroup: myDBSubnetGroup,
      allocatedStorage: 5
    });

    // Lambda
    const myLambdaFunction = new lambda.Function(this, 'MyLambdaFunction', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler',
      code: lambda.Code.fromBucket(s3.Bucket.fromBucketName(this, 'LambdaCodeBucket', 'test-lambda-bucket-488266856645'), 'index.zip'),
      role: lambda.Role.fromRoleArn(this, 'LambdaExecutionRole', 'arn:aws:iam::488266856645:role/LambdaExecutionRole'),
      functionName: 'MyLambdaFunctionName',
      memorySize: 256,
      timeout: cdk.Duration.seconds(10)
    });

    // API Gateway
    const myApi = new apigateway.RestApi(this, 'MyApi', {
      restApiName: 'MyAPI',
      description: 'My API',
      failOnWarnings: true
    });

    // WAF
    const myWebACL = new wafv2.CfnWebACL(this, 'MyWebACL', {
      defaultAction: { allow: {} },
      scope: 'REGIONAL',
      visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'myWebAclMetric'
      },
      name: 'myWebAcl',
      description: 'My WAF WebACL'
    });

    // S3 Bucket for frontend
    const frontendBucket = new s3.Bucket(this, 'FrontendBucket', {
      bucketName: 'kingkold.tech',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'error.html',
      publicReadAccess: true
    });

    // Cognito User Pool
    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'MyUserPool'
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      clientName: 'MyUserPoolClient'
    });

    // Route 53
    const myHostedZone = new route53.HostedZone(this, 'MyHostedZone', {
      zoneName: 'kingkold.tech'
    });

    const frontendRecordSet = new route53.ARecord(this, 'FrontendRecordSet', {
      zone: myHostedZone,
      target: route53.RecordTarget.fromAlias(new targets.BucketWebsiteTarget(frontendBucket)),
      recordName: 'kingkold.tech'
    });
  }
}
