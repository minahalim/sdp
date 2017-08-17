"use strict";

var lodash = require("lodash");

function allPropertiesExist(object, arrPropsToCheck) {
    return lodash.every(arrPropsToCheck, val => lodash.has(object, val));
}

function atLeastOnePropertyExists(object, arrPropsToCheck) {
    return lodash.some(arrPropsToCheck, val => lodash.has(object, val));
}

function isNotEmptyObject(object) {
    return typeof object === "object" && object !== null;
}

module.exports = {
    allPropertiesExist,
    isNotEmptyObject,
    atLeastOnePropertyExists
};
