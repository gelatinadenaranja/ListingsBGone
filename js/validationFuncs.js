"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPrice = exports.checkName = exports.wereCheckboxesAdded = exports.checkPriceInput = exports.checkQuantityInput = void 0;
const utils_1 = require("./utils");
const elementGetters_1 = require("./elementGetters");
function checkQuantityInput() {
    //Validation for 'bGoneQuantityInput' element input.
    const element = document.getElementById('bGoneQuantityInput');
    if (element.value === '') {
        return true;
    }
    ;
    let value = Number.parseInt(element.value);
    if (!Number.isNaN(value) && value > 0 && value <= (0, elementGetters_1.getListingsAmount)()) {
        return true;
    }
    else {
        element.value = '';
        return false;
    }
    ;
}
exports.checkQuantityInput = checkQuantityInput;
;
function checkPriceInput() {
    //Validation for 'bGonePriceInputBar' element input.
    const element = document.getElementById('bGonePriceInputBar');
    if (element.value === '') {
        return true;
    }
    ;
    const selectorElem = document.getElementById('bGonePriceInputSelector');
    const selectorValue = selectorElem.value;
    let value;
    if (selectorValue !== '3') {
        //In case the range option isn't used.
        value = Number.parseFloat((0, utils_1.removeCommas)(element.value));
        if (!Number.isNaN(value) && value > 0) {
            element.value = value.toString();
            return true;
        }
        else {
            element.value = '';
            return false;
        }
        ;
    }
    else {
        //In case the range option is used.
        let fullRangeValues = element.value;
        let rangeValues;
        rangeValues = fullRangeValues.split('-');
        if (rangeValues.length !== 2) { //ADD CHECK FOR ARRAY DATATYPE
            element.value = '';
            return false;
        }
        ;
        //Check each array element individually.
        for (let index = 0; index < 2; index++) {
            rangeValues[index] = (0, utils_1.removeCommas)(rangeValues[index]);
            for (let i = 0; i < rangeValues[index].length; i++) {
                if (isNaN(Number.parseInt(rangeValues[index].charAt(i))) && rangeValues[index].charAt(i) !== '.') {
                    element.value = '';
                    return false;
                }
                ;
            }
            ;
        }
        ;
        //Can't have a range with two equal values.
        if (Number.parseFloat(rangeValues[0]) === Number.parseFloat(rangeValues[1])) {
            return false;
        }
        ;
        //Sorting range values acordingly (Min value-Max value).
        if (Number.parseFloat(rangeValues[0]) > Number.parseFloat(rangeValues[1])) {
            let maxValue = Number.parseFloat(rangeValues[0]);
            rangeValues[0] = rangeValues[1];
            rangeValues[1] = maxValue.toString();
        }
        ;
        element.value = rangeValues[0] + '-' + rangeValues[1];
        return true;
    }
    ;
}
exports.checkPriceInput = checkPriceInput;
;
function wereCheckboxesAdded() {
    //Check if the checkbox elements were added to the 'tabContentsMyActiveMarketListingsRows' children already.
    const listingsContainer = document.getElementById('tabContentsMyActiveMarketListingsRows');
    let listingElement;
    let elementFirstChild = document.createElement('div');
    if (listingsContainer) {
        listingElement = listingsContainer.firstElementChild;
        elementFirstChild = listingElement.firstElementChild;
    }
    ;
    if ((elementFirstChild.className === 'bGoneCheckboxContainer') && (elementFirstChild.tagName === 'LABEL')) {
        return true;
    }
    else {
        return false;
    }
    ;
}
exports.wereCheckboxesAdded = wereCheckboxesAdded;
;
function checkName(nameParam, itemName) {
    if (nameParam === '')
        return true;
    return nameParam == itemName;
}
exports.checkName = checkName;
;
function checkPrice(priceParam, price, mode, maxPrice) {
    if (Number.isNaN(priceParam))
        return true;
    /*
    0 - Equal to
    1 - More than
    2 - Less than
    3 - Range
    */ //Check this function out, don't think it makes sense
    switch (mode) {
        case '0':
            return priceParam === price;
        case '1':
            return priceParam < price;
        case '2':
            return priceParam > price;
        case '3':
            return (priceParam < price) && (price < maxPrice);
        default:
            console.log('Using default price search mode for some reason.');
            return price == priceParam;
    }
    ;
}
exports.checkPrice = checkPrice;
;
