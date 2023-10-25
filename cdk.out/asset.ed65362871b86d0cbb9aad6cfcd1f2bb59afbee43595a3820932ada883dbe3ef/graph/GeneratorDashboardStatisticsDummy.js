const { getPastDate } = require("../util/DateTimeUtil");
const { setStartTimeSlot } = require("../util/DateTimeUtil");
const { setEndTimeSlot } = require("../util/DateTimeUtil");
const { setCurrentTimeSlot } = require("../util/DateTimeUtil");
const { randomIntBetween } = require("../util/RandomUtil");
const { randomFloatBetween } = require("../util/RandomUtil");
const { throwExposableError } = require("../util/ResponseUtil");
const { getDummyFeedParams } = require("./_DefaultsDummy");
const supportedOptions = [
    'LASTDAY'
];

const getGraphData = ({ input, user, tenant }) => {
    console.log("Generating graph data for :", input);
    if (!supportedOptions.includes(input.graphOption)) {
        throwExposableError(`Unsupported graph option ${input.graphOption} for ${input.graphName}`);
    }

    const graphRange = getGraphDateRange(input);
    let statisticsData = getStatisticsDataPoints(input, tenant);

    return {
        graphName: input.graphName,
        graphOption: input.graphOption,
        graphStartTime: graphRange.graphStartTime,
        graphEndTime: graphRange.graphEndTime,
        intervalValue: graphRange.intervalValue,
        intervalUnit: graphRange.intervalUnit,
        statisticsData: statisticsData
    };
};

const getStatisticsDataPoints = (input, tenant) => {
    let statisticsData = {};
    if (input.graphOption === 'LASTDAY') {
        statisticsData = populateLastDayData(statisticsData, tenant);
    }

    return statisticsData;
};

const populateLastDayData = (statisticsData, tenant) => {
    let dfm = getDummyFeedParams(tenant);
    let ds = dfm.assetDashboardStatistics;

    // populating asset performance percentage for last day
    let percentageMin = ds.assetPerformancePercentageMin;
    let percentageMax = ds.assetPerformancePercentageMax;
    statisticsData.assetPerformancePercentage =  percentageMax;
   
    // populating energy generation for the last day
    let energyGenerationUnit = ds.energyGenerationUnit;
    let energyGenerationMin = ds.energyGenerationMin;
    let energyGenerationMax = ds.energyGenerationMax;
    let energyGenerationChange = ds.energyGenerationChange;
    statisticsData.generation = randomFloatBetween(energyGenerationMin, energyGenerationMax);
    statisticsData.generationChange = randomIntBetween(1, energyGenerationChange);
    statisticsData.generationUnit = energyGenerationUnit;
    // populating revenue 
    let revenueUnit = ds.revenueUnit;
    let revenueMin = ds.revenueMin;
    let revenueMax = ds.revenueMax;
    let revenueChange = ds.revenueChange;
    statisticsData.revenue = randomFloatBetween(revenueMin, revenueMax);
    statisticsData.revenueChange = randomIntBetween(1, revenueChange);
    statisticsData.revenueUnit = revenueUnit;
    // populating avarage price per unit
    let averagePriceUnit = ds.averagePriceUnit;
    let averagePriceMin = ds.averagePriceMin;
    let averagePriceMax = ds.averagePriceMax;
    let averagePriceChange = ds.averagePriceChange;
    statisticsData.averageUnitPrice = randomFloatBetween(averagePriceMin, averagePriceMax);
    statisticsData.averageUnitChange = randomIntBetween(1, averagePriceChange);
    statisticsData.averagePriceUnit = averagePriceUnit;
    // populating assets information
    let cs = dfm.assets;
    let totalAssets = cs.totalAssets;
    let totalAssetsChange = cs.totalAssetsChange;
    statisticsData.totalAssets = totalAssets;
    statisticsData.assetsChange = -1 * randomIntBetween(1, totalAssetsChange);
    return statisticsData;
}


const getGraphDateRange = (input) => {
    const today = new Date();
    let graphStartTime = new Date();
    let graphEndTime = new Date();
    let intervalValue = '30';
    let intervalUnit = 'minutes';

    if (input.graphOption === 'YESTERDAY' || input.graphOption === 'LASTDAY') {
        let dayShiftCount = input.graphOption === 'YESTERDAY' ? 1 : 2;
        graphStartTime = getPastDate(today, dayShiftCount);
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = getPastDate(today, dayShiftCount);
        graphEndTime = setEndTimeSlot(graphEndTime);

    } else if (input.graphOption === 'TODAY') {
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = setCurrentTimeSlot(graphEndTime);

    } else if (input.graphOption === 'LAST30DAYS') {
        intervalValue = '1';
        intervalUnit = 'days';
        graphStartTime = getPastDate(today, 30);
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = setCurrentTimeSlot(graphEndTime);

    } else if (input.graphOption === 'LAST12MONTHS') {
        intervalValue = '1';
        intervalUnit = 'months';
        graphStartTime.setFullYear(graphStartTime.getFullYear() - 1);
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphStartTime.setDate(1);
        graphEndTime = setCurrentTimeSlot(graphEndTime);
    }

    return {
        graphStartTime: graphStartTime,
        graphEndTime: graphEndTime,
        intervalValue: intervalValue,
        intervalUnit: intervalUnit,
    }
};

module.exports = {
    getGraphData: getGraphData
};