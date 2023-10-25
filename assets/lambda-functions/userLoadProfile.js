const {  DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocument.from(ddbClient);

exports.handler = async function(event) {
  console.log(`event: ${JSON.stringify(event)}`);

  try {
    const input = validateInputs(event);
    const userSummary = await findUserByEmail(input);

    // default response 
    let response = {
      tenantUserFound: false
    }
    if(userSummary) {
      const fullUserDetail = await loadFullUser(userSummary);

      if(fullUserDetail.cognitoId !== input.cognitoId) {
        throwExposableError('Invalid user details');
      }

      response = {
        tenantUserFound: true,
        tenantUser: {
          userId : fullUserDetail.userId,
          userEmail : fullUserDetail.userEmail,
          firstName : fullUserDetail.firstName,
          lastName : fullUserDetail.lastName,
          designation : fullUserDetail.designation,
          companyCode: fullUserDetail.companyCode,
          companyName : fullUserDetail.companyName,
          companyId : fullUserDetail.companyId,
          // tenantType : fullUserDetail.tenantType
        }
      };
      if(input.includeTenantSummary) {
        await attachTenantDetails(response);
      }   
    }
   
    return handleSuccess(response);

  } catch (error) {
    return handleError(error);
  }
};

const attachTenantDetails = async(response) => {
  const queryResult = await docClient.query({
    TableName: process.env.TENANT_TABLE_NAME,
    IndexName: "tenantCodeIndex",
    KeyConditionExpression: 'tenantCode = :tenantCode AND tenantStatus = :tenantStatus',
    ExpressionAttributeValues: {
      ':tenantCode': response.tenantUser.companyCode,
      ':tenantStatus': 'ACTIVE'
    },
  });

  if(queryResult.Items.length === 0) {
    throwExposableError(`Tenant not found for companyCode ${response.tenantUser.companyCode}`);
  } else if(queryResult.Items.length > 1) {
    throwExposableError(`Duplicate tenants found for companyCode ${response.tenantUser.companyCode}`);
  }
  const tenant = queryResult.Items[0];
  response.tenantUser.companyPin = tenant.tenantPin;
  response.tenantUser.tenantType = tenant.tenantType
  response.tenantUser.tenantNameFull = tenant.tenantNameFull;
  response.tenantUser.tenantNameShort = tenant.tenantNameShort;
  response.tenantUser.tenantIconBgColor = tenant.tenantIconBgColor;
  response.tenantUser.tenantIconTextColor = tenant.tenantIconTextColor;
}

const loadFullUser = async(userSummary) => {
  const queryResult = await docClient.get({
    TableName: process.env.USER_TABLE_NAME,
    Key: {
      userId: userSummary.userId,
      userEmail: userSummary.userEmail,
    },
  });

  return queryResult.Item;
};

const findUserByEmail = async(input) => {
  const queryResult = await docClient.query({
    TableName: process.env.USER_TABLE_NAME,
    IndexName: "userEmailIndex",
    KeyConditionExpression: 'userEmail = :userEmail AND userStatus = :userStatus',
    ExpressionAttributeValues: {
      ':userEmail': input.userEmail,
      ':userStatus': 'ACTIVE'
    },
  });

  if(queryResult.Items.length > 1) {
    throwExposableError(`Duplicate users found for email ${input.userEmail}`);
  }

  return queryResult.Items[0];
};

const validateInputs = (event) => {
  let input = {};
  if (event.body !== null && event.body !== undefined) {
    input = JSON.parse(event.body)
  } else {
    throwExposableError("Input parameters are empty");
  }

  if(!input.cognitoId)
    throwExposableError("Input parameter cognitoId is empty");

  if(!input.userEmail)
    throwExposableError("Input parameter userEmail is empty");

  return input;
};

const throwExposableError = (message) => {
  throw Error(message, {cause: { expose: true } });
};

const handleSuccess = (response) => {
  console.log(`Function successfully executed, response: ${JSON.stringify(response)}`);
  return {
    statusCode: 200,
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods" : "*"
    },
    body: JSON.stringify(response)
  };
};

const handleError = (error) => {
  console.log("Internal function error", error);
  let errorMessage = "Function execution error";
  if(error.cause?.expose) {
    errorMessage = error.message;
  }
  return {
    statusCode: 409,
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods" : "*"
    },
    body: JSON.stringify({ message: errorMessage })
  };
};