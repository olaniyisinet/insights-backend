const { getDateOnlyString } = require("../util/DateTimeUtil");
const { geShortDayName } = require("../util/DateTimeUtil");
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
    'LAST7DAYS',
    'LAST30DAYS',
    'LAST6MONTHS',
    'LAST12MONTHS'
];

const getGraphData = ({ input, user, tenant }) => {
    console.log("Generating graph data for :", input);
    if (!supportedOptions.includes(input.graphOption)) {
        throwExposableError(`Unsupported graph option ${input.graphOption} for ${input.graphName}`);
    }
    const graphRange = getGraphDateRange(input);
    const dfm = getDummyFeedParams(tenant);
    const generatorppaKpi = dfm.generatorppaKpi;
    let ppaAssetAvailabilityUnit = ppaKpi.ppaAssetAvailabilityUnit;
    let graphData = generatorppaKpi;//getGraphDataPoints(input, graphRange, generatorppaKpi);

    return {
        graphName: input.graphName,
        graphOption: input.graphOption,
        graphStartTime: graphRange.graphStartTime,
        graphEndTime: graphRange.graphEndTime,
        intervalValue: graphRange.intervalValue,
        intervalUnit: graphRange.intervalUnit,
        graphDataUnit: ppaAssetAvailabilityUnit,
        graphData: graphData
    };
};

const getGraphDataPoints = (input, graphRange, generatorppaKpi) => {
    let graphData = [];
    let lineData = [];
    if (input.graphOption === 'YESTERDAY'
        || input.graphOption === 'TODAY'
        || input.graphOption === 'LASTDAY') {
        let graphEndHour = graphRange.graphEndTime.getHours();
        let graphEndMinute = graphRange.graphEndTime.getMinutes();
        for (let slot = 0; slot < 24; slot++) {
            // populate the slot one, first half an hour
            let slotOneName = `${slot < 10 ? "0" + slot : slot}:00`;
            let isZeroSlotOne = graphEndHour < slot;
            populateRadndomDataSeries(graphData, lineData, slotOneName, isZeroSlotOne, generatorppaKpi);
        }
    } else if (input.graphOption === 'LAST7DAYS') {
        for (let slot = 0; slot < 7; slot++) {
            let slotDate = new Date(graphRange.graphStartTime.getTime());
            slotDate.setDate(slotDate.getDate() + slot);
            let slotName = geShortDayName(slotDate);
            populateRadndomDataSeries(graphData, lineData, slotName, false, generatorppaKpi);
        }
    } else if (input.graphOption === 'LAST30DAYS') {
        for (let slot = 0; slot < 30; slot++) {
            let slotDate = new Date(graphRange.graphStartTime.getTime());
            slotDate.setDate(slotDate.getDate() + slot);
            let slotName = getDateOnlyString(slotDate);
            populateRadndomDataSeries(graphData, lineData, slotName, false, generatorppaKpi);
        }
    } else if (input.graphOption === 'LAST6MONTHS') {
        for (let slot = 0; slot < 30; slot++) {
                let slotDate = new Date( graphRange.graphStartTime.getTime());
            slotDate.setMonth(slotDate.getMonth() + slot);
            let slotName = `${slotDate.getFullYear()}-${slotDate.getMonth() + 1}`;
            populateRadndomDataSeries(graphData, lineData, slotName, false, generatorppaKpi);
        }
    } else if (input.graphOption === 'LAST12MONTHS') {
        for (let slot = 0; slot < 12; slot++) {
            let slotDate = new Date(graphRange.graphStartTime.getTime());
            slotDate.setMonth(slotDate.getMonth() + slot);
            let slotName = `${slotDate.getFullYear()}-${slotDate.getMonth() + 1}`;
            populateRadndomDataSeries(graphData, lineData, slotName, false, generatorppaKpi);
        }
    }

    return {
        mainData: graphData,
        lineData: lineData,
    };
};

const populateRadndomDataSeries = (graphData, lineData, slotName, isZero, generatorppaKpi) => {
    let ppaAssetAvailabilityMin = generatorppaKpi.ppaAssetAvailabilityMin;
    let ppaAssetAvailabilityMax = generatorppaKpi.ppaAssetAvailabilityMax;
    let ppaAssetAvailabilityUsage = generatorppaKpi.ppaSssetAvailabilityUsage;
    populateRandomDataPoint('Actual', graphData, {
        timeSlot: slotName,
        minNumber: ppaAssetAvailabilityMin,
        maxNumber: ppaAssetAvailabilityMax,
        isZero: isZero
    });
    populateConstantDataPoint('Agreed', lineData, {
        timeSlot: slotName,
        baseValue: ppaAssetAvailabilityUsage,
        isZero: isZero
    });
}

const populateRandomDataPoint = (name, graphData, props) => {
    let minNumber = props.minNumber;
    let maxNumber = props.maxNumber;
    let randamValue = randomIntBetween(minNumber, maxNumber);
    let param = {
        name: name,
        date: props.timeSlot,
    };
    if (!props.isZero)
        param.usage = randamValue;

    graphData.push(param);
};

const populateConstantDataPoint = (name, graphData, props) => {
    let constantValue = props.baseValue;
    let param = {
        name: name,
        date: props.timeSlot,
    };
    if (!props.isZero)
        param.usage = constantValue;

    graphData.push(param);
};

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

    } else if (input.graphOption === 'LAST30DAYS' || input.graphOption === 'LAST7DAYS') {
        intervalValue = '1';
        intervalUnit = 'days';
        let dayShiftCount = input.graphOption === 'LAST30DAYS' ? 30 : 7;
        graphStartTime = getPastDate(today, dayShiftCount);
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = setCurrentTimeSlot(graphEndTime);

    } else if (input.graphOption === 'LAST6MONTHS') {
        intervalValue = '1';
        intervalUnit = 'months';
        graphStartTime.setMonth(graphStartTime.getMonth() - 6);
        graphStartTime.setDate(1);
        graphStartTime = setStartTimeSlot(graphStartTime);
        graphEndTime = setCurrentTimeSlot(graphEndTime);
    }else if (input.graphOption === 'LAST12MONTHS') {
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