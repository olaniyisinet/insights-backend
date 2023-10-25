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
    let cs = dfm.assetsRevenuePortfolio;
    let revenuePortfolioUnit = '£';
    let graphData = getGraphDataPoints(input, cs);

    return {
        graphName: input.graphName,
        graphOption: input.graphOption,
        graphStartTime: graphRange.graphStartTime, 
        graphEndTime:  graphRange.graphEndTime,
        intervalValue: graphRange.intervalValue,
        intervalUnit: graphRange.intervalUnit,
        graphDataUnit: revenuePortfolioUnit,
        graphData: graphData
    };
};

const getGraphDataPoints = (input, cs) => {
    let graphData = cs;
    if (input.graphOption === 'LAST7DAYS') {
        // graphData.value = Math.floor(Math.random() * 1000);
        for (const item of graphData) {
            // Perform your calculation or update logic here
            // For example, increment the value by 100
            item.value += Math.floor(Math.random() * 1000);;
          }
    } else if (input.graphOption === 'LAST30DAYS') {
        graphData.value = Math.floor(Math.random() * 5000);
    } else if (input.graphOption === 'LAST6MONTH') {
        graphData.value = Math.floor(Math.random() * 10000);
    }
    else if (input.graphOption === 'LAST12MONTHS') {
        graphData.value = Math.floor(Math.random() * 150000);
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