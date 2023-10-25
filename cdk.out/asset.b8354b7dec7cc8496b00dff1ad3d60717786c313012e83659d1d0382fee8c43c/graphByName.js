const {  DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocument } = require("@aws-sdk/lib-dynamodb");
const { handleSuccess } = require("./util/ResponseUtil");
const { handleError } = require("./util/ResponseUtil");
const { throwExposableError } = require("./util/ResponseUtil");
const costSavingsDummy = require("./graph/CostSavingsDummy");
const emissionSavingsDummy = require("./graph/EmissionSavingsDummy");
const greenEnergyUsageDummy = require("./graph/GreenEnergyUsageDummy");
const gridCompositionDummy = require("./graph/GridCompositionDummy");
const renewableCompositionDummy = require("./graph/RenewableCompositionDummy");
const gridVsRenewablesDummy = require('./graph/GridVsRenewablesDummy');
const dashboardStatisticsDummy = require('./graph/DashboardStatisticsDummy');
const ppaSupplyDummy = require('./graph/PPASupplyDummy');
const assetAvailabilityDummy = require('./graph/AssetAvailabilityDummy');
const regoCertificatesDummy = require('./graph/REGOCertificatesDummy');
const generatorDashboardStatisticsDummy = require('./graph/GeneratorDashboardStatisticsDummy');
const generatorRevenueDummy = require('./graph/GeneratorRevenueDummy');

const ddbClient = new DynamoDBClient({});
const docClient = DynamoDBDocument.from(ddbClient);
const graphMapping = {
  'cost-savings-dummy': costSavingsDummy,
  'emission-savings-dummy': emissionSavingsDummy,
  'green-energy-usage-dummy': greenEnergyUsageDummy,
  'green-energy-usage-dummy': greenEnergyUsageDummy,
  'grid-composition-dummy': gridCompositionDummy,
  'renewable-composition-dummy': renewableCompositionDummy,
  'grid-vs-renewables-dummy': gridVsRenewablesDummy,
  'dashboard-statistics-dummy' : dashboardStatisticsDummy,
  'ppa-supply-dummy' : ppaSupplyDummy,
  'asset-availability-dummy' : assetAvailabilityDummy,
  'rego-certificates-dummy' : regoCertificatesDummy,
  'generator-dashboard-statistics-dummy': generatorDashboardStatisticsDummy,
  'asset-revenue-dummy': generatorRevenueDummy
};

exports.handler = async function(event) {
  console.log(`event: ${JSON.stringify(event)}`);

  try {
    const input = validateInputs(event);
    const user = await findUserByPK(input);
    const tenant = await findTenantByPK(user);

    // constructing the full mapping name of the graph
    const graphFullName = `${input.graphName}-${tenant.dataFeedType.toLowerCase()}`;
    console.log(`Graph full name:  ${graphFullName}`);

    // validating the full name of the graph
    let availalbeGraps = Object.getOwnPropertyNames(graphMapping);
    if(!availalbeGraps.includes(graphFullName)) {
      throwExposableError(`No graph mapping found for the ${graphFullName}`);
    }

    // executing relevant graph hander for the above graph full name 
    const graphDataHandler = graphMapping[graphFullName];
    let response = graphDataHandler.getGraphData({
      input: input,
      user: user,
      tenant: tenant,
    });
    return handleSuccess(response);

  } catch (error) {
    return handleError(error);
  }
};

const findTenantByPK = async(user) => {
  const queryResult = await docClient.get({
    TableName: process.env.TENANT_TABLE_NAME,
    Key: {
      tenantId: user.companyId,
      tenantCode: user.companyCode,
    },
  });

  if(!queryResult.Item)
    throwExposableError("Invalid user infomation");

  return queryResult.Item;
};

const findUserByPK = async(input) => {
  const queryResult = await docClient.get({
    TableName: process.env.USER_TABLE_NAME,
    Key: {
      userId: input.userId,
      userEmail: input.userEmail,
    },
  });

  if(!queryResult.Item)
    throwExposableError("Invalid user infomation");

  return queryResult.Item;
};

const validateInputs = (event) => {
  let input = {};
  if (event.body !== null && event.body !== undefined) {
    input = JSON.parse(event.body)
  } else {
    throwExposableError("Input parameters are empty");
  }

  if(!input.userId)
    throwExposableError("Input parameter userId is empty");

  if(!input.userEmail)
    throwExposableError("Input parameter userEmail is empty");

  if(!input.graphName)
    throwExposableError("Input parameter graphName is empty");

  if(!input.graphOption)
    throwExposableError("Input parameter graphOption is empty");  

  return input;
};