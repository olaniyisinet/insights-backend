const {  DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const crypto = require('crypto');

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocument.from(ddbClient);

exports.handler = async function(event) {
  console.log(`event: ${JSON.stringify(event)}`);

  try {
    const timestamp = Date.now().toString();
    const input = validateInputs(event);
    const userId = crypto.randomUUID();

    await validateExistingUser(input);
    await validateDuplicateUserId(userId);
    const tenant = await validateTenantDetails(input);

    const createParam = {
      userId : userId,
      cognitoId: input.cognitoId,
      userEmail : input.userEmail,
      userStatus: "ACTIVE",
      firstName : input.firstName,
      lastName : input.lastName,
      designation : input.designation,
      companyName : tenant.tenantNameFull,
      companyCode : tenant.tenantCode,
      companyId : tenant.tenantId,
      // tenantType : tenant.tenantType,
      _metaSetupCompanyName : input.companyName,
      _metaSetupCompanyCode : input.companyCode,
      _metaSetupCompanyPin : input.companyPin,
      _metaSetupTimestamp : timestamp,
    }
    await createNewUser(createParam);
    
    // return response
    let response = {
      userId : createParam.userId,
      userEmail : createParam.userEmail,
      firstName : createParam.firstName,
      lastName : createParam.lastName,
      designation : createParam.designation,
      companyName : createParam.companyName,
      companyCode : createParam.companyCode,
      companyId : createParam.companyId,
      companyPin : tenant.tenantPin,
      // tenantType : tenant.tenantType,
      tenantNameFull : tenant.tenantNameFull,
      tenantNameShort : tenant.tenantNameShort,
      tenantIconBgColor : tenant.tenantIconBgColor,
      tenantIconTextColor : tenant.tenantIconTextColor,
    };
    return handleSuccess(response);

  } catch (error) {
    return handleError(error);
  }
};

const createNewUser = async(createParam) => {
  const createResult = await docClient.put( {
      TableName: process.env.USER_TABLE_NAME,
      Item: createParam
    }
  );
  console.log("createNewUser: ", createResult);
}

const validateTenantDetails = async(input) => {
  const queryResult = await docClient.query({
    TableName: process.env.TENANT_TABLE_NAME,
    IndexName: "tenantCodeIndex",
    KeyConditionExpression: 'tenantCode = :tenantCode AND tenantStatus = :tenantStatus',
    ExpressionAttributeValues: {
      ':tenantCode': input.companyCode,
      ':tenantStatus': 'ACTIVE'
    },
  });

  if(queryResult.Items.length === 0) {
    throwExposableError(`Tenant not found for companyCode ${input.companyCode}`);
  } else if(queryResult.Items.length > 1) {
    throwExposableError(`Duplicate tenants found for companyCode ${input.companyCode}`);
  }

  if(queryResult.Items[0].tenantPin !== input.companyPin){
    throwExposableError('Invalid company infomation');
  }

  return queryResult.Items[0];
}

const validateDuplicateUserId = async(userId) => {
  const queryResult = await docClient.query({
    TableName: process.env.USER_TABLE_NAME,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': userId
    },
  });

  if(queryResult.Items.length > 0) {
    throwExposableError("Internal error, please try again");
  }
}

const validateExistingUser = async(input) => {
  const queryResult = await docClient.query({
    TableName: process.env.USER_TABLE_NAME,
    IndexName: "userEmailIndex",
    KeyConditionExpression: 'userEmail = :userEmail AND userStatus = :userStatus',
    ExpressionAttributeValues: {
      ':userEmail': input.userEmail,
      ':userStatus': 'ACTIVE'
    },
  });

  if(queryResult.Items.length > 0) {
    throwExposableError("User already exists with same email");
  }
}

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

  if(!input.firstName)
    throwExposableError("Input parameter firstName is empty");

  if(!input.lastName)
    throwExposableError("Input parameter lastName is empty");

  if(!input.designation)
    throwExposableError("Input parameter designation is empty");

  if(!input.companyName)
    throwExposableError("Input parameter companyName is empty");

  if(!input.companyCode)
    throwExposableError("Input parameter companyCode is empty");

  if(!input.companyPin)
    throwExposableError("Input parameter companyPin is empty");

  return input;
}

const throwExposableError = (message) => {
  throw Error(message, {cause: { expose: true } });
}

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
}

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
}