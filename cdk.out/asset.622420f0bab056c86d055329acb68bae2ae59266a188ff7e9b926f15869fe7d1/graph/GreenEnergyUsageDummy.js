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
    let renewableUsage = dfm.renewableUsage;
    let renewableUsageUnit = renewableUsage.renewableUsageUnit;
    let graphData = getGraphDataPoints(input, graphRange, renewableUsage);

    return {
        graphName: input.graphName,
        graphOption: input.graphOption,
        graphStartTime: graphRange.graphStartTime, 
        graphEndTime:  graphRange.graphEndTime,
        intervalValue: graphRange.intervalValue,
        intervalUnit: graphRange.intervalUnit,
        graphDataUnit: renewableUsageUnit,
        graphData: graphData
    };
};

const getGraphDataPoints = (input, graphRange, renewableUsage) => {
    let graphData = [];
    if(input.graphOption === 'YESTERDAY' 
        || input.graphOption === 'TODAY'
        || input.graphOption === 'LASTDAY') {
        let graphEndHour = graphRange.graphEndTime.getHours();
        let graphEndMinute = graphRange.graphEndTime.getMinutes();
        for (let slot = 0; slot < 24; slot++) {
            // populate the slot one, first half an hour
            let slotOneName = `${slot < 10 ? "0" + slot : slot}:00`;
            let isZeroSlotOne = graphEndHour < slot;
            populateRadndomDataSeries(graphData, slotOneName, isZeroSlotOne, renewableUsage, 1/48);
            // populate the slot one, second half an hour
            let slotTwoName = `${slot < 10 ? "0" + slot : slot}:30`;
            let isZeroSlotTwo = isZeroSlotOne || graphEndHour === slot && graphEndMinute !== 30;
            populateRadndomDataSeries(graphData, slotTwoName, isZeroSlotTwo, renewableUsage, 1/48);
        }
    } else if(input.graphOption === 'LAST30DAYS') {
        for (let slot = 0; slot < 30; slot++) {
            let slotDate = new Date( graphRange.graphStartTime.getTime() );
            slotDate.setDate(slotDate.getDate() + slot);
            let slotName = getDateOnlyString(slotDate);
            populateRadndomDataSeries(graphData, slotName, false, renewableUsage, 1);
        }
    } else if(input.graphOption === 'LAST12MONTHS') {
        for (let slot = 0; slot < 12; slot++) {
            let slotDate = new Date( graphRange.graphStartTime.getTime() );
            slotDate.setMonth(slotDate.getMonth() + slot);
            let slotName = `${slotDate.getFullYear()}-${slotDate.getMonth() + 1}`;
            populateRadndomDataSeries(graphData, slotName, false, renewableUsage, 30);
        }
    }

    return graphData;
};

const populateRadndomDataSeries = (graphData, slotName, isZero, renewableUsage, multiplicationFactor) => {
    const solarMin = renewableUsage.solarUsageDailyMin;
    const solarMax = renewableUsage.solarUsageDailyMax;
    const solarIsZero = isZero || solarMax === 0;
    const windMin = renewableUsage.windUsageDailyMin;
    const windMax = renewableUsage.windUsageDailyMax;
    const windIsZero = isZero || windMax === 0;
    const hydroMin = renewableUsage.hydroUsageDailyMin;
    const hydroMax = renewableUsage.hydroUsageDailyMax;
    const hydroIsZero = isZero || hydroMax === 0;
   
    populateRandomDataPoint('Hydro', graphData, {
        timeSlot: slotName,
        multiplicationFactor: multiplicationFactor,
        minNumber: hydroMin,
        maxNumber: hydroMax,
        isZero: hydroIsZero
    });
    populateRandomDataPoint('Wind', graphData, {
        timeSlot: slotName,
        multiplicationFactor: multiplicationFactor,
        minNumber: windMin,
        maxNumber: windMax,
        isZero: windIsZero
    });
    populateRandomDataPoint('Solar', graphData, {
        timeSlot: slotName,
        multiplicationFactor: multiplicationFactor,
        minNumber: solarMin,
        maxNumber: solarMax,
        isZero: solarIsZero
    });
}

const populateRandomDataPoint = (name, graphData, props) => {
    let mf = props.multiplicationFactor;
    let minNumber  =  props.minNumber;
    let maxNumber  =  props.maxNumber;
    let randamUsage = Math.floor(randomIntBetween(minNumber, maxNumber) * mf);
    let param = {
        name: name,
        date: props.timeSlot,
    };
    if(!props.isZero)
        param.usage = randamUsage;
        
    graphData.push(param);
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
        graphStartTime.setDate(1);
        graphStartTime = setStartTimeSlot(graphStartTime);
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