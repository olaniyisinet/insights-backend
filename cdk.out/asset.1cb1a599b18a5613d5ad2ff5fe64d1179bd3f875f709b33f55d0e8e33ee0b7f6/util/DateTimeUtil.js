const setStartTimeSlot = (date) => {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

const setEndTimeSlot = (date) => {
    date.setHours(23);
    date.setMinutes(30);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

const setCurrentTimeSlot = (date) => {
    let currentTime  =  new Date();
    let cuurentHours = currentTime.getHours();
    let currentMinutes = currentTime.getMinutes();
    currentMinutes = currentMinutes > 30 ? 30 : 0;
    date.setHours(cuurentHours);
    date.setMinutes(currentMinutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
}

const getDateOnlyString = (date) => {
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if(month < 10) {
        month = "0" + month;
    }
    let dayOfMonth = date.getDate();
    let dateString = `${year}-${month}-${dayOfMonth}`;

    return dateString;
}

const geShortDayName = (date) => {
    let dayStr = date.toLocaleString( 'en-us', { weekday: 'long'});
    return dayStr.substring(0, 3);
}

const getLongDayName = (date) => {
    let dayStr = date.toLocaleString( 'en-us', { weekday: 'long'});
    return dayStr;
}

const getPastDate = (date, dayCount) => {
    return new Date(new Date().setDate(date.getDate() - dayCount));
}

module.exports = {
    getDateOnlyString: getDateOnlyString,
    getPastDate : getPastDate,
    setStartTimeSlot: setStartTimeSlot,
    setEndTimeSlot: setEndTimeSlot,
    setCurrentTimeSlot: setCurrentTimeSlot,
    geShortDayName: geShortDayName,
    getLongDayName: getLongDayName
};