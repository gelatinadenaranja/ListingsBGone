"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearInputFields = exports.startSearch = exports.selectAllCheckboxes = exports.lockInputs = void 0;
const elementGetters_1 = require("./elementGetters");
const validationFuncs_1 = require("./validationFuncs");
const httpRequestFuncs_1 = require("./httpRequestFuncs");
function lockInputs() {
    const searchBarButton = document.getElementById('bGoneSearchBarButton');
    searchBarButton.setAttribute('disabled', 'true');
    const searchBar = document.getElementById('bGoneSearchBar');
    searchBar.setAttribute('disabled', 'true');
    const priceInputBar = document.getElementById('bGonePriceInputBar');
    priceInputBar.setAttribute('disabled', 'true');
    const priceInputSelector = document.getElementById('bGonePriceInputSelector');
    priceInputSelector.setAttribute('disabled', 'true');
    const quantityInput = document.getElementById('bGoneQuantityInput');
    quantityInput.setAttribute('disabled', 'true');
}
exports.lockInputs = lockInputs;
;
function selectAllCheckboxes() {
    //Check all checkbox elements in the 'tabContentsMyActiveMarketListingsRows' children.
    const listingContainer = document.getElementById('tabContentsMyActiveMarketListingsRows');
    const selectAllCheckbox = document.getElementById('bGoneSelectAllCheckbox');
    if (!listingContainer || !selectAllCheckbox)
        return;
    const listingRowElements = listingContainer.children;
    const bGoneCheckboxItems = [];
    const query = 'div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox';
    for (let item of listingRowElements) {
        if (item.querySelector(query)) {
            let inputElem = item.querySelector(query);
            bGoneCheckboxItems.push(inputElem);
        }
        ;
    }
    ;
    if (selectAllCheckbox.checked) {
        for (let checkbox of bGoneCheckboxItems) {
            checkbox.checked = true;
        }
        ;
    }
    else {
        for (let checkbox of bGoneCheckboxItems) {
            checkbox.checked = false;
        }
        ;
    }
    ;
}
exports.selectAllCheckboxes = selectAllCheckboxes;
;
function startSearch(prevStartValue) {
    let nameInput = (0, elementGetters_1.getNameInputValue)();
    let priceInput = (0, elementGetters_1.getPriceInputValue)();
    //Input fields check.
    if (nameInput === '' && priceInput === '') {
        alert("Can't perform search with both item name and price empty.");
        clearInputFields();
        return 'allEmpty';
    }
    else {
        let isPriceValid = (0, validationFuncs_1.checkPriceInput)();
        if (!isPriceValid) {
            let priceSearchMode = (0, elementGetters_1.getSelectorValue)();
            if (priceSearchMode === '3') {
                alert('Input price range is not valid.\nFirst write the minimum value, then a dash (-) and then the maximum value.\nExample: 1.05-3');
                return 'invalidRange';
            }
            else {
                alert('Input price is not valid.\nOnly values over 0 are accepted.\nExample: 100.25');
                return 'invalidPrice';
            }
            ;
        }
        ;
        let isQuantityValid = (0, validationFuncs_1.checkQuantityInput)();
        if (!isQuantityValid) {
            alert('Input quantity is not valid.\nOnly integers between 0 and the quantity of existing listings are valid.\nExample: 1');
            return 'invalidQuantity';
        }
        ;
    }
    ;
    //Here starts the first iteration of the search.
    if (typeof prevStartValue === undefined || prevStartValue === null) {
        lockInputs();
        (0, httpRequestFuncs_1.getMarketListings)(0, 100);
        return 'startedSearch';
    }
    ;
    //Either continue or finish the search.
    let listingsAmount = (0, elementGetters_1.getListingsAmount)();
    if (prevStartValue !== undefined && listingsAmount > (prevStartValue + 100)) {
        (0, httpRequestFuncs_1.getMarketListings)(prevStartValue + 100, 100);
        return 'continueSearch';
    }
    else {
        //Finished search. Straight up refresh the page for now.
        //window.location.reload();
        /*refreshListings();
        unlockInputs();*/
        return 'endSearch';
    }
    ;
}
exports.startSearch = startSearch;
;
function clearInputFields() {
    const nameInput = document.getElementById('bGoneSearchBar');
    const priceInput = document.getElementById('bGonePriceInputBar');
    const quantityInput = document.getElementById('bGoneQuantityInput');
    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';
}
exports.clearInputFields = clearInputFields;
;
