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

const getGraphData = ({input, user, tenant}) => {
    console.log("Generating graph data for :", input);
    if(!supportedOptions.includes(input.graphOption)) {
        throwExposableError(`Unsupported graph option ${input.graphOption} for ${input.graphName}`);
    }

    const graphRange = getGraphDateRange(input);
    let statisticsData = getStatisticsDataPoints(input, tenant);

    return {
        graphName: input.graphName,
        graphOption: input.graphOption,
        graphStartTime: graphRange.graphStartTime, 
        graphEndTime:  graphRange.graphEndTime,
        intervalValue: graphRange.intervalValue,
        intervalUnit: graphRange.intervalUnit,
        statisticsData: statisticsData
    };
};

const getStatisticsDataPoints = (input, tenant) => {
    let statisticsData = {};
    if(input.graphOption === 'LASTDAY' ) {
        statisticsData = populateLastDayData(statisticsData, tenant);
    } 

    return statisticsData;
};

const populateLastDayData = (statisticsData, tenant) => {
    let dfm = getDummyFeedParams(tenant);
    let ds = dfm.dashboardStatistics;
    // populating renewwable percentage for last day
    let percentageMin = ds.renewablePercentageMin;
    let percentageMax = ds.renewablePercentageMax;
    statisticsData.renewablePrecentage = percentageMax;
    // populating the daily consumtion for last day
    let dailyConsumptionUnit = ds.dailyConsumptionUnit;
    let dailyConsumptionMin = ds.dailyConsumptionMin;
    let dailyConsumptionMax = ds.dailyConsumptionMax;
    let dailyConsumptionChange = ds.dailyConsumptionChange;
    statisticsData.consumption = randomFloatBetween(dailyConsumptionMin, dailyConsumptionMax);
    statisticsData.consumptionChange = randomIntBetween(1, dailyConsumptionChange);
    statisticsData.consumptionUnit = dailyConsumptionUnit;
    // populating most consumed hour
    let mostConsumedUnit = ds.mostConsumedUnit;
    let mostConsumedMin = ds.mostConsumedMin;
    let mostConsumedMax = ds.mostConsumedMax;
    let mostConsumedBetween = ds.mostConsumedBetween;
    let startingHour = parseInt(mostConsumedBetween.substring(0,2));
    let endingHour = parseInt(mostConsumedBetween.substring(3));
    statisticsData.mostConsumed = randomFloatBetween(mostConsumedMin, mostConsumedMax);
    statisticsData.mostConsumedHour = randomIntBetween(startingHour, endingHour);
    statisticsData.mostConsumedUnit = mostConsumedUnit;
    // populating avarage price per unit
    let averagePriceUnit = ds.averagePriceUnit;
    let averagePriceMin = ds.averagePriceMin;
    let averagePriceMax = ds.averagePriceMax;
    let averagePriceChange = ds.averagePriceChange;
    statisticsData.averageUnitPrice = randomFloatBetween(averagePriceMin, averagePriceMax);
    statisticsData.averageUnitChange =  randomIntBetween(1, averagePriceChange);
    statisticsData.averagePriceUnit = averagePriceUnit;
    // populating cost savings per day
    let cs = dfm.costSavings;
    let costSavingsPerDayUnit = cs.costSavingsPerDayUnit;
    let costSavingsPerDayMin = cs.costSavingsPerDayMin;
    let costSavingsPerDayMax = cs.costSavingsPerDayMax;
    let costSavingsPerDayChange = cs.costSavingsPerDayChange;
    statisticsData.costSaving = randomIntBetween(costSavingsPerDayMin, costSavingsPerDayMax);
    statisticsData.costSavingChange = -1 * randomIntBetween(1, costSavingsPerDayChange);
    statisticsData.costSavingUnit = costSavingsPerDayUnit;
    return statisticsData;
}


const getGraphDateRange = (input) => {
    const today = new Date();
    let graphStartTime = new Date();
    let graphEndTime = new Date();
    let intervalValue = '30';
    let intervalUnit = 'minutes';

    if(input.graphOption === 'YESTERDAY' || input.graphOption === 'LASTDAY') {
        let dayShiftCount = input.graphOption === 'YESTERDAY' ? 1 : 2;
        graphStartTime = getPastDate(today, dayShiftCount);
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = getPastDate(today, dayShiftCount);
        graphEndTime = setEndTimeSlot(graphEndTime);

    } else if(input.graphOption === 'TODAY') {
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = setCurrentTimeSlot(graphEndTime);

    } else if(input.graphOption === 'LAST30DAYS') {
        intervalValue = '1';
        intervalUnit = 'days';
        graphStartTime = getPastDate(today, 30);
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = setCurrentTimeSlot(graphEndTime);  

    } else if(input.graphOption === 'LAST12MONTHS') {
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