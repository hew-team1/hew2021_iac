import * as cdk from '@aws-cdk/core';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export class DynamoDBStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here

    //! EndUsers Table Create
    //! PrimaryKey: uid(STRING)
    new dynamodb.Table(this, "end_users", {
      partitionKey: {
        name: "uid",
        type: dynamodb.AttributeType.STRING
      },
      tableName: "EndUsers",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    //! Recruit Table Create
    //! PrimaryKey: id(NUMBER)
    new dynamodb.Table(this, "recruits", {
      partitionKey: {
        name: "id",
        type: dynamodb.AttributeType.NUMBER
      },
      tableName: "Recruits",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    //! AtomicCounter Table Create
    //! PrimaryKey: countKey(STRING)
    new dynamodb.Table(this, "atomiccounters", {
      partitionKey: {
        name: "countKey",
        type: dynamodb.AttributeType.STRING
      },
      tableName: "AtomicCounter",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
  }
}