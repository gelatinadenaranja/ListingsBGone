"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchMatchingListings = exports.parseMarketListingsData = exports.getMarketListings = exports.removeItemListing = exports.refreshListings = void 0;
const utils_1 = require("./utils");
const elementGetters_1 = require("./elementGetters");
const validationFuncs_1 = require("./validationFuncs");
const elementEvents_1 = require("./elementEvents");
function refreshListings() {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        if (httpRequest.status === 200) {
            ;
            let requestResult = httpRequest.responseText;
            const jsonObj = JSON.parse(requestResult);
            const dataResultObj = jsonObj;
            //Fix mess later
            if (dataResultObj) {
                let listingElements = document.createElement('div');
                listingElements.innerHTML = dataResultObj['results_html'];
                const listingRows = listingElements.querySelector('div#tabContentsMyActiveMarketListingsRows');
                const siteListingsContainer = document.getElementById('tabContentsMyActiveMarketListingsRows');
                if (listingRows !== null) {
                    siteListingsContainer.innerHTML = listingRows.innerHTML;
                }
                ;
            }
            else {
                console.log('Failed to load listings: Data in JSON not found.');
                return;
            }
            ;
        }
        else {
            console.log("Something happened and couldn't get the requested listings data.\nRequest status=" + httpRequest.status);
        }
        ;
    };
    const queryStartValue = (Number.parseInt((0, utils_1.getActiveListingPagingPage)()) - 1) * (0, utils_1.getListingsPerPage)();
    httpRequest.open('GET', 'https://steamcommunity.com/market/mylistings/?start=' + queryStartValue + '&count=' + (0, utils_1.getListingsPerPage)(), true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send();
}
exports.refreshListings = refreshListings;
;
function removeItemListing(listingId, checkboxElement) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        if (httpRequest.status === 200) {
            if (checkboxElement !== null) {
                checkboxElement.checked = false;
            }
            ;
            const listingElement = document.getElementById('mylisting_' + listingId);
            if (listingElement) {
                listingElement.style.display = 'none';
            }
            ;
            let listingsNumber = (0, elementGetters_1.getListingsAmount)();
            if (!isNaN(listingsNumber) && isFinite(listingsNumber)) {
                listingsNumber = listingsNumber - 1;
                let activeListings = document.getElementById('my_market_activelistings_number');
                activeListings.innerHTML = listingsNumber.toString();
                let sellListings = document.getElementById('my_market_selllistings_number');
                sellListings.innerHTML = listingsNumber.toString();
                let resultsCount = document.getElementById('tabContentsMyActiveMarketListings_total');
                resultsCount.innerHTML = listingsNumber.toString();
            }
            ;
        }
        else {
            console.log(httpRequest.status);
        }
        ;
    };
    httpRequest.open('POST', 'https://steamcommunity.com/market/removelisting/' + listingId, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send('sessionid=' + (0, utils_1.getSessionIdCookie)());
}
exports.removeItemListing = removeItemListing;
;
function getMarketListings(start, count) {
    if (start === undefined)
        start = 0;
    if (count === undefined)
        count = 10;
    let httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        if (httpRequest.status === 200) {
            parseMarketListingsData(httpRequest.responseText, start);
        }
        else {
            console.log("Something happened and couldn't get the requested listings data.\nRequest status=" + httpRequest.status);
        }
        ;
    };
    //Use: https://steamcommunity.com/market/mylistings/?query=&start=0&count=
    httpRequest.open('GET', 'https://steamcommunity.com/market/mylistings/?start=' + start + '&count=' + count, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send();
}
exports.getMarketListings = getMarketListings;
;
function parseMarketListingsData(data, startVal) {
    let listingsDataJSON;
    let listingRowElements = new HTMLCollection;
    const listingsData = [];
    ;
    let jsonObj;
    let dataResultObj;
    //Fix mess later
    if (data !== 'null' && data.length > 0) {
        jsonObj = JSON.parse(data);
        dataResultObj = jsonObj;
    }
    else {
        //JSON was null
        alert("JSON was null, couldn't search listings");
        return;
    }
    ;
    if (dataResultObj.hasOwnProperty('results_html')) {
        const activeListingsTable = document.createElement('div');
        activeListingsTable.innerHTML = dataResultObj['results_html'];
        const querySelectorString = 'div > div#tabContentsMyActiveMarketListingsTable > div#tabContentsMyActiveMarketListingsRows';
        let listingsElement = activeListingsTable.querySelector(querySelectorString);
        //Tidy up all this
        if (listingsElement) {
            listingRowElements = listingsElement.children;
        }
        ;
    }
    else {
        alert('Field with listing data could not be found');
        return;
    }
    ;
    if (!listingRowElements) {
        console.log("listingRowElements = undefined ");
        console.log(listingRowElements);
    }
    ;
    //Need: id, name, price
    let listingNameElem;
    let listingPriceElem;
    for (let i = 0; i < listingRowElements.length; i++) {
        listingNameElem = listingRowElements[i].querySelector('a.market_listing_item_name_link');
        listingPriceElem = listingRowElements[i].querySelector('span.market_listing_price > span > span:first-child');
        listingsData.push({
            id: (0, utils_1.getItemId)(listingRowElements[i].id),
            name: listingNameElem.innerHTML,
            price: (0, utils_1.getRawPrice)(listingPriceElem.innerHTML)
        });
    }
    ;
    searchMatchingListings(listingsData, startVal);
}
exports.parseMarketListingsData = parseMarketListingsData;
;
function searchMatchingListings(listingsData, startVal) {
    let name = (0, elementGetters_1.getNameInputValue)();
    let priceInput = (0, elementGetters_1.getPriceInputValue)();
    let price;
    let maxPrice = 0;
    let priceSearchMode = (0, elementGetters_1.getSelectorValue)();
    let matchingListingsQuantity = (0, elementGetters_1.getQuantityInputValue)();
    if (priceSearchMode === '3') {
        let priceRange = priceInput.split('-');
        price = Number.parseFloat((0, utils_1.getRawPrice)(priceRange[0]));
        maxPrice = Number.parseFloat((0, utils_1.getRawPrice)(priceRange[1]));
    }
    else {
        price = Number.parseFloat(priceInput);
    }
    ;
    for (let i = 0; i < listingsData.length; i++) {
        if ((0, validationFuncs_1.checkName)(name, listingsData[i].name) && (0, validationFuncs_1.checkPrice)(price, Number.parseFloat(listingsData[i].price), priceSearchMode, maxPrice)) {
            //console.log(listingsData[i].name + '   ' + listingsData[i].price + '   ' + listingsData[i].id);
            removeItemListing(listingsData[i].id, null);
            if (!Number.isNaN(matchingListingsQuantity)) {
                if (matchingListingsQuantity > 1) {
                    matchingListingsQuantity--;
                }
                else {
                    (0, elementEvents_1.startSearch)((0, elementGetters_1.getListingsAmount)());
                    return;
                }
                ;
            }
            ;
        }
        ;
    }
    ;
    if (!Number.isNaN(matchingListingsQuantity)) {
        let quantityInput = document.getElementById('bGoneQuantityInput');
        if (quantityInput)
            quantityInput.value = matchingListingsQuantity.toString();
        //Update the amount of matching listings to be deleted.
    }
    ;
    (0, elementEvents_1.startSearch)(startVal);
}
exports.searchMatchingListings = searchMatchingListings;
;
