const { getDateOnlyString } = require("../util/DateTimeUtil");
const { getPastDate } = require("../util/DateTimeUtil");
const { setStartTimeSlot } = require("../util/DateTimeUtil");
const { setEndTimeSlot } = require("../util/DateTimeUtil");
const { setCurrentTimeSlot } = require("../util/DateTimeUtil");
const { geShortDayName } = require("../util/DateTimeUtil");
const { randomFloatBetween } = require("../util/RandomUtil");
const { throwExposableError } = require("../util/ResponseUtil");
const { getDummyFeedParams } = require("./_DefaultsDummy");
const supportedOptions = [
    'TODAY',
    'YESTERDAY',
    'LASTDAY',
    'LAST7DAYS',
    'LAST30DAYS',
    'LAST6MONTHS',
    'LAST12MONTHS'
];


const getGraphData = ({input, user, tenant}) => {
    console.log("Generating graph data for :", input);
    if(!supportedOptions.includes(input.graphOption)) {
        throwExposableError(`Unsupported graph option ${input.graphOption} for ${input.graphName}`);
    }

    const graphRange = getGraphDateRange(input);
    let dfm = getDummyFeedParams(tenant);
    let cs = dfm.assetDashboardStatistics;
    let assetvsGridUnit = cs.assetvsGridUnit;
    let graphData = getGraphDataPoints(input, cs);

    return {
        graphName: input.graphName,
        graphOption: input.graphOption,
        graphStartTime: graphRange.graphStartTime, 
        graphEndTime:  graphRange.graphEndTime,
        intervalValue: graphRange.intervalValue,
        intervalUnit: graphRange.intervalUnit,
        graphDataUnit: assetvsGridUnit,
        graphData: graphData
    };
};

const getGraphDataPoints = (input, cs) => {
    let graphData = [];
    let percentageMax = cs.assetvsGridUnitMax;
    let percentageMin = cs.assetvsGridUnitMin;

    if(input.graphOption === 'TODAY' || input.graphOption === 'LASTDAY') {
        let renewablePercentage = percentageMax;
        graphData.push({ type: 'Renewable Energy', value: renewablePercentage });
        graphData.push({ type: 'Grid Energy', value: 100 - renewablePercentage });

    } else { let renewablePercentage = randomIntBetween(percentageMin, percentageMax);
        graphData.push({ type: 'Renewable Energy', value: renewablePercentage });
        graphData.push({ type: 'Grid Energy', value: 100 - renewablePercentage });
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

    } else if(input.graphOption === 'LAST30DAYS' || input.graphOption === 'LAST7DAYS') {
        intervalValue = '1';
        intervalUnit = 'days';
        let dayShiftCount = input.graphOption === 'LAST30DAYS' ? 30 : 7;
        graphStartTime = getPastDate(today, dayShiftCount);
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = setCurrentTimeSlot(graphEndTime);  

    } else if(input.graphOption === 'LAST6MONTHS') {
        intervalValue = '1';
        intervalUnit = 'months';
        graphStartTime.setMonth(graphStartTime.getMonth() - 6);
        graphStartTime.setDate(1);
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = setCurrentTimeSlot(graphEndTime);

    }else if(input.graphOption === 'LAST12MONTHS') {
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