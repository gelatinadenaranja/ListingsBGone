"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addListingsElementObserver = exports.addListingCheckboxes = exports.addSelectAllCheckBoxContainer = exports.addExtensionElements = void 0;
const elementEvents_1 = require("./elementEvents");
const utils_1 = require("./utils");
const validationFuncs_1 = require("./validationFuncs");
const httpRequestFuncs_1 = require("./httpRequestFuncs");
function addExtensionElements() {
    const listingsContentTab = document.getElementById('tabContentsMyListings');
    //Observer to check whenever tabContentsMyListings' child elements change.
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
    //Add search elements
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
    searchBar.placeholder = 'Enter the item you wish to remove';
    searchBarContainer.append(searchBar);
    const searchBarButton = document.createElement('button');
    searchBarButton.id = 'bGoneSearchBarButton';
    searchBarButton.textContent = 'Remove';
    searchBarButton.addEventListener('click', (e) => { (0, elementEvents_1.startSearch)(undefined); });
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
    priceInputBar.placeholder = 'Enter the price of the items you want to remove';
    priceInputBar.onkeydown = function (event) {
        //Only allow desired inputs in the text field.
        const priceInputSelectorElem = document.getElementById('bGonePriceInputSelector');
        let selectorValue = priceInputSelectorElem.value;
        let validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];
        //When selectorValue === '3' a '-' gets added because that's when a range is used in the search.
        if (selectorValue === '3') {
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
    priceInputBarContainer.append(priceInputBar);
    priceInputBarContainer.append(priceInputSelector);
    const priceInputEqual = document.createElement('option');
    //priceInputEqual.value = 0;
    priceInputEqual.textContent = 'Equal to';
    priceInputSelector.append(priceInputEqual);
    const priceInputMoreThan = document.createElement('option');
    //priceInputMoreThan.value = 1;
    priceInputMoreThan.textContent = 'More Than';
    priceInputSelector.append(priceInputMoreThan);
    const priceInputLessThan = document.createElement('option');
    //priceInputLessThan.value = 2;
    priceInputLessThan.textContent = 'Less Than';
    priceInputSelector.append(priceInputLessThan);
    const priceInputRange = document.createElement('option');
    //priceInputRange.value = 3;
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
    quantityInputBar.onkeydown = function (event) {
        //Only allow desired inputs in the text field.
        let validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];
        if (!validInputs.includes(event.key)) {
            event.preventDefault();
        }
        ;
    };
    quantityInputContainer.append(quantityInputBar);
    /*TESTING BUTTONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN*/
    /*let tstbutton = document.createElement('button');
    tstbutton.id = 'tstbutton';
    tstbutton.textContent = 'CLICK ME SON!';
    tstbutton.onclick = setActiveListingPagingPage;
    bGoneSearchBarContainer.append(tstbutton);*/
}
exports.addExtensionElements = addExtensionElements;
;
function addSelectAllCheckBoxContainer() {
    //Add a div to manage the currently visible listings in the 'tabContentsMyActiveMarketListingsRows' element.
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
    selectAllCheckbox.onclick = elementEvents_1.selectAllCheckboxes;
    selectAllContainer.append(selectAllCheckbox);
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    selectAllCheckBoxContainer.append(buttonContainer);
    const refreshListingsButton = document.createElement('button');
    refreshListingsButton.id = 'bGoneRefreshListingsButton';
    refreshListingsButton.title = 'Refresh listings';
    refreshListingsButton.onclick = httpRequestFuncs_1.refreshListings;
    buttonContainer.append(refreshListingsButton);
    const refreshListingsButtonIcon = document.createElement('img');
    refreshListingsButtonIcon.src = chrome.runtime.getURL('images/refresh_items_button_icon.png');
    refreshListingsButton.append(refreshListingsButtonIcon);
    const removeCheckedItems = document.createElement('button');
    removeCheckedItems.id = 'bGoneRemoveCheckedItems';
    removeCheckedItems.textContent = 'Remove checked items';
    removeCheckedItems.onclick = function () {
        /* Remove all listings where the checkbox elements in the 'tabContentsMyActiveMarketListingsRows'
         * children are checked and the children are visible. Then if no listings are visible, refresh. */
        const listingContainer = document.getElementById('tabContentsMyActiveMarketListingsRows');
        const listingRowElements = listingContainer.children;
        const querySelectorString = 'div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox:checked';
        const selectAllCheckbox = document.getElementById('bGoneSelectAllCheckbox');
        let visibleListings = (0, utils_1.getListingsPerPage)();
        for (let i = 0; i < listingRowElements.length; i++) {
            if (listingRowElements[i].getAttribute('style') !== 'display: none;') {
                if (listingRowElements[i].querySelector(querySelectorString)) {
                    const checkboxElem = listingRowElements[i].querySelector(querySelectorString);
                    (0, httpRequestFuncs_1.removeItemListing)((0, utils_1.getItemId)(listingRowElements[i].id), checkboxElem);
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
            (0, httpRequestFuncs_1.refreshListings)();
        }
        ;
        selectAllCheckbox.checked = false;
    };
    buttonContainer.append(removeCheckedItems);
    const removeCheckedItemsIcon = document.createElement('img');
    removeCheckedItemsIcon.src = chrome.runtime.getURL('images/remove_items_button_icon.png');
    removeCheckedItems.append(removeCheckedItemsIcon);
    activeListingsTable.insertBefore(selectAllCheckBoxContainer, document.getElementById('tabContentsMyActiveMarketListingsRows'));
}
exports.addSelectAllCheckBoxContainer = addSelectAllCheckBoxContainer;
;
function addListingCheckboxes() {
    //Add the checkbox elements to 'tabContentsMyActiveMarketListingsRows' children.
    const listingRow = document.getElementById('tabContentsMyActiveMarketListingsRows');
    const listingRowElements = listingRow.children;
    for (let i = 0; i < listingRowElements.length; i++) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'bGoneCheckbox';
        //document.createTextNode(checkbox);
        const checkboxContainer = document.createElement('label');
        checkboxContainer.className = 'bGoneCheckboxContainer';
        checkboxContainer.append(checkbox);
        listingRowElements[i].insertBefore(checkboxContainer, listingRowElements[i].firstElementChild);
    }
    ;
}
exports.addListingCheckboxes = addListingCheckboxes;
;
function addListingsElementObserver() {
    //Observer to check whenever 'tabContentsMyActiveMarketListingsRows' changes, which is when the user selects another item page.
    const listingsContainer = document.getElementById('tabContentsMyActiveMarketListingsRows');
    const listingsContainerObserver = new MutationObserver(function (mutationList) {
        //Observer to check whenever 'tabContentsMyActiveMarketListingsRows' changes, which is when the user selects another item page.
        for (const mutation of mutationList) {
            if (mutation.type === 'childList' && !(0, validationFuncs_1.wereCheckboxesAdded)()) {
                addListingCheckboxes();
            }
            ;
        }
        ;
    });
    listingsContainerObserver.observe(listingsContainer, { childList: true });
}
exports.addListingsElementObserver = addListingsElementObserver;
;
