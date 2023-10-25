const defaultDummyParams = require('./_DefaultsDummy.json');

const getDummyFeedParams = (tenant) => {
    let dataFeedParams = tenant?.dataFeedParams ? tenant.dataFeedParams : {};
    return {...defaultDummyParams, ...dataFeedParams};
};


module.exports = {
    getDummyFeedParams: getDummyFeedParams
};