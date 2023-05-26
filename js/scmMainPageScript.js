"use strict";
function parseMarketListingsData(data, startVal) {
    let listingRowElements;
    const listingsData = [];
    ;
    let jsonObj;
    let dataResultObj;
    if (data !== 'null' && data.length > 0) {
        jsonObj = JSON.parse(data);
        dataResultObj = jsonObj;
    }
    else {
        alert("JSON was null, couldn't search listings");
        return;
    }
    ;
    if (dataResultObj.hasOwnProperty('results_html')) {
        const activeListingsTable = document.createElement('div');
        activeListingsTable.innerHTML = dataResultObj['results_html'];
        const querySelectorString = 'div > div#tabContentsMyActiveMarketListingsTable > div#tabContentsMyActiveMarketListingsRows';
        let listingsElement = activeListingsTable.querySelector(querySelectorString);
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
    if (listingRowElements === undefined) {
        console.log("listingRowElements = undefined ");
        console.log(listingRowElements);
        return;
    }
    ;
    let listingNameElem;
    let listingPriceElem;
    for (let i = 0; i < listingRowElements.length; i++) {
        listingNameElem = listingRowElements[i].querySelector('a.market_listing_item_name_link');
        listingPriceElem = listingRowElements[i].querySelector('span.market_listing_price > span > span:first-child');
        listingsData.push({
            id: getItemId(listingRowElements[i].id),
            name: listingNameElem.innerHTML,
            price: getRawPrice(listingPriceElem.innerHTML)
        });
    }
    ;
    searchMatchingListings(listingsData, startVal);
}
;
function searchMatchingListings(listingsData, startVal) {
    let name = getNameInputValue();
    let priceInput = getPriceInputValue();
    let price;
    let maxPrice = 0;
    let priceSearchMode = getPriceModeSelectorValue();
    let matchingListingsQuantity = getQuantityInputValue();
    if (priceSearchMode === 'Range') {
        let priceRange = priceInput.split('-');
        price = Number.parseFloat(getRawPrice(priceRange[0]));
        maxPrice = Number.parseFloat(getRawPrice(priceRange[1]));
    }
    else {
        price = Number.parseFloat(priceInput);
    }
    ;
    for (let i = 0; i < listingsData.length; i++) {
        if (checkName(name, listingsData[i].name) && checkPrice(price, Number.parseFloat(listingsData[i].price), priceSearchMode, maxPrice)) {
            if (getSearchModeSelectorValue() == 'Remove listings') {
                removeItemListing(listingsData[i].id, null, true);
            }
            ;
            setListingsCounter(getListingsCounter() + 1);
            if (!Number.isNaN(matchingListingsQuantity) && getSearchModeSelectorValue() != 'Remove listings') {
                if (matchingListingsQuantity > 1) {
                    matchingListingsQuantity--;
                }
                else {
                    startSearch(getListingsAmount());
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
    }
    ;
    startSearch(startVal);
}
;
const priceInputBarOnKeyDownEvt = function (event) {
    let selectorValue = getPriceModeSelectorValue();
    let validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];
    if (selectorValue === 'Range') {
        validInputs.push('-');
        if (!validInputs.includes(event.key)) {
            event.preventDefault();
        }
        ;
    }
    else {
        if (!validInputs.includes(event.key)) {
            event.preventDefault();
        }
        ;
    }
};
const quantityInputBarOnKeyDownEvt = function (event) {
    let validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];
    if (!validInputs.includes(event.key)) {
        event.preventDefault();
    }
    ;
};
const removeCheckedItemsBtnEvt = function () {
    const listingContainer = document.getElementById('tabContentsMyActiveMarketListingsRows');
    const listingRowElements = listingContainer.children;
    const querySelectorString = 'div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox:checked';
    const selectAllCheckbox = document.getElementById('bGoneSelectAllCheckbox');
    let visibleListings = getListingsPerPage();
    for (let i = 0; i < listingRowElements.length; i++) {
        if (listingRowElements[i].getAttribute('style') !== 'display: none;') {
            if (listingRowElements[i].querySelector(querySelectorString)) {
                const checkboxElem = listingRowElements[i].querySelector(querySelectorString);
                removeItemListing(getItemId(listingRowElements[i].id), checkboxElem, false);
                visibleListings--;
            }
            ;
        }
        else {
            visibleListings--;
        }
        ;
    }
    ;
    if (visibleListings <= 0) {
        refreshListings();
    }
    ;
    selectAllCheckbox.checked = false;
};
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
    const searchModeSelector = document.getElementById('bGoneSettingButton');
    searchModeSelector.setAttribute('disabled', 'true');
}
;
function unlockInputs() {
    const searchBarButton = document.getElementById('bGoneSearchBarButton');
    searchBarButton.disabled = false;
    const searchBar = document.getElementById('bGoneSearchBar');
    searchBar.disabled = false;
    searchBar.value = '';
    const priceInputBar = document.getElementById('bGonePriceInputBar');
    priceInputBar.disabled = false;
    priceInputBar.value = '';
    const priceInputSelector = document.getElementById('bGonePriceInputSelector');
    priceInputSelector.disabled = false;
    const quantityInput = document.getElementById('bGoneQuantityInput');
    quantityInput.disabled = false;
    quantityInput.value = '';
    const searchModeSelector = document.getElementById('bGoneSettingButton');
    searchModeSelector.disabled = false;
}
;
function selectAllCheckboxes() {
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
;
function showInfoBox() {
    const loadingIconElem = getLoadingIconElem();
    const infoSpanElem = getInfoSpanElem();
    const countingSpanElem = getCountingSpanElem();
    if (infoSpanElem == null || loadingIconElem == null || countingSpanElem == null) {
        console.log('showInfoBox could not find one or more required elements.');
        return false;
    }
    ;
    const searchMode = getSearchModeSelectorValue();
    if (searchMode === 'Remove listings') {
        infoSpanElem.textContent = 'Listings removed: ';
    }
    else if (searchMode === 'Count listings') {
        infoSpanElem.textContent = 'Listings found: ';
    }
    else {
        infoSpanElem.textContent = 'Error, invalid bGoneSettingButton value';
        return false;
    }
    ;
    loadingIconElem.setAttribute('style', '');
    return true;
}
;
function startSearch(prevStartValue) {
    let nameInput = getNameInputValue();
    let priceInput = getPriceInputValue();
    if (nameInput === '' && priceInput === '') {
        alert("Can't perform search with both item name and price empty.");
        clearInputFields();
        return 'allEmpty';
    }
    else {
        let isPriceValid = checkPriceInput();
        if (!isPriceValid) {
            let priceSearchMode = getPriceModeSelectorValue();
            if (priceSearchMode === 'Range') {
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
        let isQuantityValid = checkQuantityInput();
        if (!isQuantityValid) {
            alert('Input quantity is not valid.\nOnly integers between 0 and the quantity of existing listings are valid.\nExample: 1');
            return 'invalidQuantity';
        }
        ;
    }
    ;
    if (prevStartValue === undefined) {
        setCountingSpanValue(0);
        setListingsCounter(0);
        showInfoBox();
        lockInputs();
        getMarketListings(0, 100);
        return 'startedSearch';
    }
    ;
    let listingsAmount = getListingsAmount();
    if (prevStartValue !== undefined && listingsAmount > (prevStartValue + 100)) {
        getMarketListings(prevStartValue + 100, 100);
        return 'continueSearch';
    }
    else {
        if (getSearchModeSelectorValue() == 'Count listings') {
            unlockInputs();
            hideLoadingIcon();
            showPopUp('Found ' + getListingsCounter() + ' matches.');
            setCountingSpanValue(getListingsCounter());
            setListingsCounter(0);
        }
        else {
            restartSearchAfterRequests();
        }
        ;
        return 'endSearch';
    }
    ;
}
;
function clearInputFields() {
    const nameInput = document.getElementById('bGoneSearchBar');
    const priceInput = document.getElementById('bGonePriceInputBar');
    const quantityInput = document.getElementById('bGoneQuantityInput');
    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';
}
;
const changeSearchMode = function () {
    const searchButtonElem = document.getElementById('bGoneSearchBarButton');
    const searchModeSelect = document.getElementById('bGoneSettingButton');
    const quantityInput = document.getElementById('bGoneQuantityInput');
    if (searchButtonElem && searchModeSelect && quantityInput) {
        if (searchModeSelect.value === 'Count listings') {
            searchButtonElem.textContent = 'Count';
            quantityInput.setAttribute('style', 'display: none');
        }
        else {
            searchButtonElem.textContent = 'Remove';
            quantityInput.setAttribute('style', '');
        }
        ;
    }
    ;
};
function getNameInputValue() {
    const inputElem = document.getElementById('bGoneSearchBar');
    if (!inputElem) {
        console.log('Error with the bGoneSearchBar element');
        return 'Name not Found';
    }
    ;
    return inputElem.value;
}
;
function getPriceInputValue() {
    const inputElem = document.getElementById('bGonePriceInputBar');
    return inputElem ? inputElem.value : '-1';
}
;
function getPriceModeSelectorValue() {
    const selectorElem = document.getElementById('bGonePriceInputSelector');
    return selectorElem ? selectorElem.value : '-1';
}
;
function getQuantityInputValue() {
    const inputElem = document.getElementById('bGoneQuantityInput');
    return inputElem ? Number.parseInt(inputElem.value) : -1;
}
;
function getListingsAmount() {
    const listingCountElem = document.getElementById('my_market_activelistings_number');
    let listingsAmount = Number.parseInt(listingCountElem.innerHTML);
    if (Number.isNaN(listingsAmount))
        return -1;
    return listingsAmount;
}
;
function getSearchModeSelectorValue() {
    const selectorElem = document.getElementById('bGoneSettingButton');
    return selectorElem ? selectorElem.value : '-1';
}
;
function getLoadingIconElem() {
    const loadingIconElem = document.getElementById('bGoneLoadingIcon');
    return loadingIconElem ? loadingIconElem : null;
}
;
function getInfoSpanElem() {
    const infoSpanElem = document.getElementById('bGoneInfoBoxSpan');
    return infoSpanElem ? infoSpanElem : null;
}
;
function getCountingSpanElem() {
    const countingSpan = document.getElementById('bGoneCountingSpan');
    return countingSpan ? countingSpan : null;
}
;
function getCountingSpanValue() {
    const countingSpan = document.getElementById('bGoneCountingSpan');
    let count = Number.parseInt(countingSpan.innerHTML);
    if (Number.isNaN(count))
        return 0;
    return count;
}
;
function addExtensionElements() {
    const listingsContentTab = document.getElementById('tabContentsMyListings');
    const listingsContentTabObserver = new MutationObserver(function (mutationList) {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                addSelectAllCheckBoxContainer();
                addListingCheckboxes();
                addListingsElementObserver();
            }
            ;
        }
        ;
    });
    listingsContentTabObserver.observe(listingsContentTab, { childList: true });
    addSelectAllCheckBoxContainer();
    addListingCheckboxes();
    addListingsElementObserver();
    const bGoneSearchBarContainer = document.createElement('div');
    bGoneSearchBarContainer.id = 'bGoneSearchBarContainer';
    const mainContentDiv = document.getElementById('mainContents');
    mainContentDiv.insertBefore(bGoneSearchBarContainer, document.getElementById('myListings'));
    const searchBarContainer = document.createElement('div');
    searchBarContainer.className = 'bGoneInputContainer';
    bGoneSearchBarContainer.append(searchBarContainer);
    const searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.id = 'bGoneSearchBar';
    searchBar.className = 'bGoneInputBar';
    searchBar.placeholder = 'Enter the full name of the item';
    searchBarContainer.append(searchBar);
    const searchBarButton = document.createElement('button');
    searchBarButton.id = 'bGoneSearchBarButton';
    searchBarButton.textContent = 'Remove';
    searchBarButton.addEventListener('click', (e) => { startSearch(undefined); });
    searchBarContainer.append(searchBarButton);
    const priceInputBarContainer = document.createElement('div');
    priceInputBarContainer.className = 'bGoneInputContainer';
    bGoneSearchBarContainer.append(priceInputBarContainer);
    const priceInputSelector = document.createElement('select');
    priceInputSelector.id = 'bGonePriceInputSelector';
    const priceInputBar = document.createElement('input');
    priceInputBar.type = 'text';
    priceInputBar.id = 'bGonePriceInputBar';
    priceInputBar.className = 'bGoneInputBar';
    priceInputBar.placeholder = 'Enter the price of the listings you want to match';
    priceInputBar.onkeydown = priceInputBarOnKeyDownEvt;
    priceInputBarContainer.append(priceInputBar);
    priceInputBarContainer.append(priceInputSelector);
    const priceInputEqual = document.createElement('option');
    priceInputEqual.textContent = 'Equal to';
    priceInputSelector.append(priceInputEqual);
    const priceInputMoreThan = document.createElement('option');
    priceInputMoreThan.textContent = 'More Than';
    priceInputSelector.append(priceInputMoreThan);
    const priceInputLessThan = document.createElement('option');
    priceInputLessThan.textContent = 'Less Than';
    priceInputSelector.append(priceInputLessThan);
    const priceInputRange = document.createElement('option');
    priceInputRange.textContent = 'Range';
    priceInputSelector.append(priceInputRange);
    const quantityInputContainer = document.createElement('div');
    quantityInputContainer.className = 'bGoneInputContainer';
    bGoneSearchBarContainer.append(quantityInputContainer);
    const quantityInputBar = document.createElement('input');
    quantityInputBar.type = 'text';
    quantityInputBar.id = 'bGoneQuantityInput';
    quantityInputBar.className = 'bGoneInputBar';
    quantityInputBar.style.display = 'block';
    quantityInputBar.placeholder = 'Enter the quantity of matching listings you want to remove';
    quantityInputBar.onkeydown = quantityInputBarOnKeyDownEvt;
    quantityInputContainer.append(quantityInputBar);
    const menuBoxContainer = document.createElement('div');
    menuBoxContainer.className = 'bGoneMiscContainer';
    bGoneSearchBarContainer.append(menuBoxContainer);
    const infoBox = document.createElement('div');
    infoBox.id = 'bGoneInfoBox';
    menuBoxContainer.append(infoBox);
    const loadingIcon = document.createElement('img');
    loadingIcon.id = 'bGoneLoadingIcon';
    loadingIcon.src = chrome.runtime.getURL('images/loading_icon.gif');
    loadingIcon.setAttribute('style', "display: none;");
    infoBox.append(loadingIcon);
    const infoBoxSpan = document.createElement('span');
    infoBoxSpan.id = 'bGoneInfoBoxSpan';
    infoBoxSpan.textContent = '';
    infoBox.append(infoBoxSpan);
    const infoCountingSpan = document.createElement('span');
    infoCountingSpan.id = 'bGoneCountingSpan';
    infoCountingSpan.textContent = '';
    infoBox.append(infoCountingSpan);
    const settingMenu = document.createElement('select');
    settingMenu.id = 'bGoneSettingButton';
    settingMenu.addEventListener('change', changeSearchMode);
    menuBoxContainer.append(settingMenu);
    const settingRemoveListing = document.createElement('option');
    settingRemoveListing.textContent = 'Remove listings';
    settingMenu.append(settingRemoveListing);
    const settingCountListing = document.createElement('option');
    settingCountListing.textContent = 'Count listings';
    settingMenu.append(settingCountListing);
}
;
function addSelectAllCheckBoxContainer() {
    const activeListingsTable = document.getElementById('tabContentsMyActiveMarketListingsTable');
    const selectAllCheckBoxContainer = document.createElement('div');
    selectAllCheckBoxContainer.id = 'bGoneSelectAllCheckBoxContainer';
    const selectAllContainer = document.createElement('label');
    selectAllContainer.id = 'bGoneSelectAllContainer';
    selectAllContainer.textContent = 'Select all shown listings';
    selectAllCheckBoxContainer.append(selectAllContainer);
    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'bGoneSelectAllCheckbox';
    selectAllCheckbox.onclick = selectAllCheckboxes;
    selectAllContainer.append(selectAllCheckbox);
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    selectAllCheckBoxContainer.append(buttonContainer);
    const refreshListingsButton = document.createElement('button');
    refreshListingsButton.id = 'bGoneRefreshListingsButton';
    refreshListingsButton.title = 'Refresh listings';
    refreshListingsButton.onclick = refreshListings;
    buttonContainer.append(refreshListingsButton);
    const refreshListingsButtonIcon = document.createElement('img');
    refreshListingsButtonIcon.src = chrome.runtime.getURL('images/refresh_items_button_icon.png');
    refreshListingsButton.append(refreshListingsButtonIcon);
    const removeCheckedItems = document.createElement('button');
    removeCheckedItems.id = 'bGoneRemoveCheckedItems';
    removeCheckedItems.textContent = 'Remove checked items';
    removeCheckedItems.onclick = removeCheckedItemsBtnEvt;
    buttonContainer.append(removeCheckedItems);
    const removeCheckedItemsIcon = document.createElement('img');
    removeCheckedItemsIcon.src = chrome.runtime.getURL('images/remove_items_button_icon.png');
    removeCheckedItems.append(removeCheckedItemsIcon);
    activeListingsTable.insertBefore(selectAllCheckBoxContainer, document.getElementById('tabContentsMyActiveMarketListingsRows'));
}
;
function addListingCheckboxes() {
    const listingRow = document.getElementById('tabContentsMyActiveMarketListingsRows');
    const listingRowElements = listingRow.children;
    for (let i = 0; i < listingRowElements.length; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'bGoneCheckbox';
        const checkboxContainer = document.createElement('label');
        checkboxContainer.className = 'bGoneCheckboxContainer';
        checkboxContainer.append(checkbox);
        listingRowElements[i].insertBefore(checkboxContainer, listingRowElements[i].firstElementChild);
    }
    ;
}
;
function addListingsElementObserver() {
    const listingsContainer = document.getElementById('tabContentsMyActiveMarketListingsRows');
    const listingsContainerObserver = new MutationObserver(function (mutationList) {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList' && !wereCheckboxesAdded()) {
                addListingCheckboxes();
            }
            ;
        }
        ;
    });
    listingsContainerObserver.observe(listingsContainer, { childList: true });
}
;
function refreshListings() {
    const httpRequest = new XMLHttpRequest();
    httpRequest.onload = function () {
        if (httpRequest.status === 200) {
            ;
            let requestResult = httpRequest.responseText;
            const jsonObj = JSON.parse(requestResult);
            const dataResultObj = jsonObj;
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
    const queryStartValue = (Number.parseInt(getActiveListingPagingPage()) - 1) * getListingsPerPage();
    httpRequest.open('GET', 'https://steamcommunity.com/market/mylistings/?start=' + queryStartValue + '&count=' + getListingsPerPage(), true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send();
}
;
function removeItemListing(listingId, checkboxElement, countRemoval) {
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
            let listingsNumber = getListingsAmount();
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
            if (countRemoval)
                setSuccessfulRequests(getSuccessfulRequests() + 1);
        }
        else {
            if (countRemoval)
                setFailedRequests(getFailedRequests() + 1);
            console.log("Listing couldn't be removed.Error: " + httpRequest.status);
        }
        ;
    };
    httpRequest.open('POST', 'https://steamcommunity.com/market/removelisting/' + listingId, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send('sessionid=' + getSessionIdCookie());
}
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
    httpRequest.open('GET', 'https://steamcommunity.com/market/mylistings/?start=' + start + '&count=' + count, true);
    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    httpRequest.send();
}
;
window.addEventListener('load', function isListingsElementAvailable() {
    if (document.getElementById('tabContentsMyActiveMarketListingsRows'))
        addExtensionElements();
});
let listingsCounter = 0;
function getListingsCounter() {
    return listingsCounter;
}
;
function setListingsCounter(val) {
    listingsCounter = val;
}
;
let successfulRequests = 0;
function getSuccessfulRequests() {
    return successfulRequests;
}
;
function setSuccessfulRequests(val) {
    successfulRequests = val;
}
;
let failedRequests = 0;
function getFailedRequests() {
    return failedRequests;
}
;
function setFailedRequests(val) {
    failedRequests = val;
}
;
function restartSearchAfterRequests() {
    const intervalID = setInterval(() => {
        if (listingsCounter === (getSuccessfulRequests() + getFailedRequests())) {
            clearInterval(intervalID);
            unlockInputs();
            hideLoadingIcon();
            setCountingSpanValue(getSuccessfulRequests());
            getFailedRequests() === 0 ?
                showPopUp('Removed ' + getSuccessfulRequests() + ' out of ' + getListingsCounter() + ' listings.') :
                showPopUp('Removed ' + getSuccessfulRequests() + ' out of ' + getListingsCounter() + ' listings.\n' + getFailedRequests() + ' Listings could not be removed.');
            setListingsCounter(0);
            setSuccessfulRequests(0);
            setFailedRequests(0);
        }
        ;
    }, 500);
}
;
function getActiveListingPagingPage() {
    let pagingElement = document.getElementById('tabContentsMyActiveMarketListings_links');
    let activePage = pagingElement.querySelector('span.market_paging_pagelink.active');
    if (!activePage || typeof activePage == 'undefined') {
        return '-1';
    }
    ;
    return activePage.innerHTML;
}
;
function getListingsPerPage() {
    let listingsPerPageStr = '';
    let returnVal = 0;
    const quantityOption10 = document.getElementById('my_listing_pagesize_10');
    const quantityOption30 = document.getElementById('my_listing_pagesize_30');
    const quantityOption100 = document.getElementById('my_listing_pagesize_100');
    const quantityOptions = [];
    quantityOptions.push(quantityOption10);
    quantityOptions.push(quantityOption30);
    quantityOptions.push(quantityOption100);
    for (let i = 0; i < quantityOptions.length; i++) {
        if (quantityOptions[i].className === 'disabled') {
            listingsPerPageStr = quantityOptions[i].innerHTML;
        }
        ;
    }
    ;
    if (listingsPerPageStr) {
        returnVal = Number.parseInt(listingsPerPageStr);
    }
    ;
    return returnVal;
}
;
function getRawPrice(price) {
    let rawPrice = price.match(/[0-9\,\.]/g);
    return rawPrice ? removeCommas(rawPrice.join('')) : '-1';
}
;
function getItemId(listingElementId) {
    if (!listingElementId) {
        console.log('getItemId() got a falsy value for an ID : ' + listingElementId);
        return '';
    }
    ;
    return listingElementId.substring(10, listingElementId.length);
}
;
function removeCommas(val) {
    for (let i = 0; i < val.length; i++) {
        if (val.charAt(i) === ',') {
            val = val.replace(/\./g, '');
            val = val.replace(/\,/g, '.');
            break;
        }
        ;
    }
    ;
    return val;
}
;
function getSessionIdCookie() {
    let cookies = document.cookie;
    let cookieFirstChar = cookies.indexOf('sessionid=') + 10;
    let cookieLastChar = cookieFirstChar;
    for (let i = cookieFirstChar; i < cookies.length; i++) {
        if (cookies.charAt(i) === ';') {
            cookieLastChar = i;
            break;
        }
        ;
    }
    ;
    return cookies.substring(cookieFirstChar, cookieLastChar);
}
;
function setCountingSpanValue(val) {
    const countingSpanElem = getCountingSpanElem();
    if (countingSpanElem === null) {
        const infoBox = document.getElementById('bGoneInfoBox');
        if (infoBox === null) {
            console.log('Element bGoneInfoBox not found.');
            return false;
        }
        ;
        const infoCountingSpan = document.createElement('span');
        infoCountingSpan.id = 'bGoneCountingSpan';
        infoCountingSpan.textContent = '0';
        infoBox.append(infoCountingSpan);
        return true;
    }
    ;
    countingSpanElem.textContent = val.toString();
    return true;
}
;
function hideLoadingIcon() {
    const loadingIconElem = getLoadingIconElem();
    if (loadingIconElem === null)
        return;
    loadingIconElem.setAttribute('style', 'display: none;');
}
;
function showPopUp(message) {
    alert(message);
}
;
function checkQuantityInput() {
    const element = document.getElementById('bGoneQuantityInput');
    if (element.value === '') {
        return true;
    }
    ;
    let value = Number.parseInt(element.value);
    if (!Number.isNaN(value) && value > 0 && value <= getListingsAmount()) {
        return true;
    }
    else {
        element.value = '';
        return false;
    }
    ;
}
;
function checkPriceInput() {
    const element = document.getElementById('bGonePriceInputBar');
    if (element.value === '') {
        return true;
    }
    ;
    const selectorValue = getPriceModeSelectorValue();
    let value;
    if (selectorValue !== 'Range') {
        value = Number.parseFloat(removeCommas(element.value));
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
        let fullRangeValues = element.value;
        let rangeValues;
        rangeValues = fullRangeValues.split('-');
        if (rangeValues.length !== 2) {
            element.value = '';
            return false;
        }
        ;
        for (let index = 0; index < 2; index++) {
            rangeValues[index] = removeCommas(rangeValues[index]);
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
        if (Number.parseFloat(rangeValues[0]) === Number.parseFloat(rangeValues[1])) {
            return false;
        }
        ;
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
;
function wereCheckboxesAdded() {
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
;
function checkName(nameParam, itemName) {
    if (nameParam === '')
        return true;
    return nameParam == itemName;
}
;
function checkPrice(priceParam, price, mode, maxPrice) {
    if (Number.isNaN(priceParam))
        return true;
    switch (mode) {
        case 'Equal to':
            return priceParam === price;
        case 'More Than':
            return priceParam < price;
        case 'Less Than':
            return priceParam > price;
        case 'Range':
            return (priceParam < price) && (price < maxPrice);
        default:
            console.log('Using default price search mode for some reason.');
            return price === priceParam;
    }
    ;
}
;
