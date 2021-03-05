import * as cdk from '@aws-cdk/core';
import { Table,AttributeType } from '@aws-cdk/aws-dynamodb';

export class DynamoDBStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    // The code that defines your stack goes here

    //! EndUsers Table Create
    //! PrimaryKey: uid(STRING)
    new Table(this, "end_users", {
      partitionKey: {
        name: "uid",
        type: AttributeType.STRING
      },
      tableName: "EndUsers",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    //! Recruit Table Create
    //! PrimaryKey: id(NUMBER)
    new Table(this, "recruits", {
      partitionKey: {
        name: "id",
        type: AttributeType.NUMBER
      },
      tableName: "Recruits",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })

    //! AtomicCounter Table Create
    //! PrimaryKey: countKey(STRING)
    new Table(this, "atomiccounters", {
      partitionKey: {
        name: "countKey",
        type: AttributeType.STRING
      },
      tableName: "AtomicCounter",
      removalPolicy: cdk.RemovalPolicy.DESTROY
    })
  }
}