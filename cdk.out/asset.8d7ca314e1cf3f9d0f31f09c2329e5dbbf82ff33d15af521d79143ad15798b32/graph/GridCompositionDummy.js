const { getDateOnlyString } = require("../util/DateTimeUtil");
const { getPastDate } = require("../util/DateTimeUtil");
const { setStartTimeSlot } = require("../util/DateTimeUtil");
const { setEndTimeSlot } = require("../util/DateTimeUtil");
const { setCurrentTimeSlot } = require("../util/DateTimeUtil");
const { throwExposableError } = require("../util/ResponseUtil");
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
    let graphData = getGraphDataPoints(input, graphRange);

    return {
        graphName: input.graphName,
        graphOption: input.graphOption,
        graphStartTime: graphRange.graphStartTime, 
        graphEndTime:  graphRange.graphEndTime,
        intervalValue: graphRange.intervalValue,
        intervalUnit: graphRange.intervalUnit,
        graphData: graphData
    };
};

const getGraphDataPoints = (input, graphRange) => {
    let graphData = [];
    if(input.graphOption === 'TODAY' ) {
        graphData = populateTodayData(graphData);

    } else if(input.graphOption === 'YESTERDAY' 
        || input.graphOption === 'LASTDAY' ) {
        graphData = populateYesterdayData(graphData);
        
    } else if(input.graphOption === 'LAST30DAYS') {
        graphData = populateLast30DaysData(graphData);

    } else if(input.graphOption === 'LAST12MONTHS') {
        graphData = populateLast12MonthsData(graphData);
    }

    return graphData;
};

const populateTodayData = (graphData) => {
    graphData.push({ type: 'Interconnector', value: 20 });
    graphData.push({ type: 'Nuclear', value: 15 }); // 35
    graphData.push({ type: 'Oil', value: 4 }); // 39
    graphData.push({ type: 'Gas', value: 14 }); // 53
    graphData.push({ type: 'Biomass', value: 6 }); // 59
    graphData.push({ type: 'Other', value: 2 }); // 61
    graphData.push({ type: 'Solar', value: 21 }); // 82
    graphData.push({ type: 'Wind', value: 17 }); // 99
    graphData.push({ type: 'Hydro', value: 1 }); // 100
    return graphData;
}

const populateYesterdayData = (graphData) => {
    graphData.push({ type: 'Interconnector', value: 18 });
    graphData.push({ type: 'Nuclear', value: 17 }); // 35
    graphData.push({ type: 'Oil', value: 3 }); // 38
    graphData.push({ type: 'Gas', value: 18 }); // 56
    graphData.push({ type: 'Biomass', value: 2 }); // 58
    graphData.push({ type: 'Other', value: 3 }); // 61
    graphData.push({ type: 'Solar', value: 18 }); // 79
    graphData.push({ type: 'Wind', value: 19 }); // 98
    graphData.push({ type: 'Hydro', value: 2 }); // 100
    return graphData;
}

const populateLast30DaysData = (graphData) => {
    graphData.push({ type: 'Interconnector', value: 15 });
    graphData.push({ type: 'Nuclear', value: 17 }); // 32
    graphData.push({ type: 'Oil', value: 7 }); // 39
    graphData.push({ type: 'Gas', value: 22 }); // 61
    graphData.push({ type: 'Biomass', value: 2 }); // 62
    graphData.push({ type: 'Other', value: 1 }); // 63
    graphData.push({ type: 'Solar', value: 18 }); // 81
    graphData.push({ type: 'Wind', value: 16 }); // 97
    graphData.push({ type: 'Hydro', value: 3 }); // 100
    return graphData;
}

const populateLast12MonthsData = (graphData) => {
    graphData.push({ type: 'Interconnector', value: 12 });
    graphData.push({ type: 'Nuclear', value: 18 }); // 30
    graphData.push({ type: 'Oil', value: 7 }); // 37
    graphData.push({ type: 'Gas', value: 24 }); // 61
    graphData.push({ type: 'Biomass', value: 2 }); // 63
    graphData.push({ type: 'Other', value: 2 }); // 65
    graphData.push({ type: 'Solar', value: 18 }); // 83
    graphData.push({ type: 'Wind', value: 16 }); // 99
    graphData.push({ type: 'Hydro', value: 1 }); // 100
    return graphData;
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