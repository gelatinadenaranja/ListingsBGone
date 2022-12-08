"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getListingsAmount = exports.getQuantityInputValue = exports.getSelectorValue = exports.getPriceInputValue = exports.getNameInputValue = void 0;
function getNameInputValue() {
    const inputElem = document.getElementById('bGoneSearchBar');
    if (!inputElem) {
        console.log('Error with the bGoneSearchBar element');
        return 'Name not Found';
    }
    ;
    return inputElem.value;
}
exports.getNameInputValue = getNameInputValue;
;
function getPriceInputValue() {
    const inputElem = document.getElementById('bGonePriceInputBar');
    return inputElem ? inputElem.value : '-1';
}
exports.getPriceInputValue = getPriceInputValue;
;
function getSelectorValue() {
    const selectorElem = document.getElementById('bGonePriceInputSelector');
    return selectorElem ? selectorElem.value : '-1';
}
exports.getSelectorValue = getSelectorValue;
;
function getQuantityInputValue() {
    const inputElem = document.getElementById('bGoneQuantityInput');
    return inputElem ? Number.parseInt(inputElem.value) : -1;
}
exports.getQuantityInputValue = getQuantityInputValue;
;
function getListingsAmount() {
    const listingCountElem = document.getElementById('my_market_activelistings_number');
    let listingsAmount = Number.parseInt(listingCountElem.innerHTML);
    if (Number.isNaN(listingsAmount))
        return -1;
    return listingsAmount;
}
exports.getListingsAmount = getListingsAmount;
;
