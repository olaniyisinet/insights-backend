const { getDateOnlyString } = require("../util/DateTimeUtil");
const { getPastDate } = require("../util/DateTimeUtil");
const { setStartTimeSlot } = require("../util/DateTimeUtil");
const { setEndTimeSlot } = require("../util/DateTimeUtil");
const { setCurrentTimeSlot } = require("../util/DateTimeUtil");
const { randomIntBetween } = require("../util/RandomUtil");
const { throwExposableError } = require("../util/ResponseUtil");
const { getDummyFeedParams } = require("./_DefaultsDummy");
const supportedOptions = [
    'TODAY',
    'YESTERDAY',
    'LASTDAY',
    'LAST30DAYS',
    'LAST12MONTHS'
];

const getGraphData = ({input, user, tenant}) => {
    console.log("Generating graph data for :", input);
    if(!supportedOptions.includes(input.graphOption)) {
        throwExposableError(`Unsupported graph option ${input.graphOption} for ${input.graphName}`);
    }

    const graphRange = getGraphDateRange(input);
    let dfm = getDummyFeedParams(tenant);
    let ru = dfm.renewableUsage;
    let ds = dfm.dashboardStatistics;
    let renewablePercentageUnit = ds.renewablePercentageUnit;
    let graphData = getGraphDataPoints(input, ru);

    return {
        graphName: input.graphName,
        graphOption: input.graphOption,
        graphStartTime: graphRange.graphStartTime, 
        graphEndTime:  graphRange.graphEndTime,
        intervalValue: graphRange.intervalValue,
        intervalUnit: graphRange.intervalUnit,
        graphDataUnit: renewablePercentageUnit,
        graphData: graphData
    };
};

const getGraphDataPoints = (input, ru) => {
    let graphData = [];
    let solarUsageDailyMax = ru.solarUsageDailyMax;
    let solarUsageDailyMin = ru.solarUsageDailyMin;
    let windUsageDailyMax = ru.windUsageDailyMax;
    let windUsageDailyMin = ru.windUsageDailyMin;
    let hydroUsageDailyMax = ru.hydroUsageDailyMax;
    let hydroUsageDailyMin = ru.hydroUsageDailyMin;


    if(input.graphOption === 'TODAY' || input.graphOption === 'LASTDAY') {

        let total = solarUsageDailyMax + windUsageDailyMax + hydroUsageDailyMax;
        let hydroPercentage = Math.floor((hydroUsageDailyMax/total)*100);
        let windPercentage = Math.floor((windUsageDailyMax/total)*100);
        let solarPercentage = 100 - (windPercentage + hydroPercentage);

        if(solarPercentage !== 0)
            graphData.push({ type: 'Solar', value: solarPercentage }); 
        
        if(windPercentage !== 0)
            graphData.push({ type: 'Wind', value: windPercentage });
        
        if(hydroPercentage !== 0)
            graphData.push({ type: 'Hydro', value: hydroPercentage }); 

    } else {

        let solarRandom = randomIntBetween(solarUsageDailyMin, solarUsageDailyMax);
        let windRandom = randomIntBetween(windUsageDailyMin, windUsageDailyMax);
        let hydroRandom = randomIntBetween(hydroUsageDailyMin, hydroUsageDailyMax);
        let total = solarRandom + windRandom + hydroRandom;
        let hydroPercentage = Math.floor((hydroRandom/total)*100);
        let windPercentage = Math.floor((windRandom/total)*100);
        let solarPercentage = 100 - (windPercentage + hydroPercentage);

        if(solarPercentage !== 0)
            graphData.push({ type: 'Solar', value: solarPercentage }); 
    
        if(windPercentage !== 0)
            graphData.push({ type: 'Wind', value: windPercentage });
        
        if(hydroPercentage !== 0)
            graphData.push({ type: 'Hydro', value: hydroPercentage }); 
        }

    return graphData;
};

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