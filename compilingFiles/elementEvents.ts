




const priceInputBarOnKeyDownEvt = function(event : KeyboardEvent) {
    //Only allow desired inputs in the text field.
    let selectorValue = getPriceModeSelectorValue();
    let validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];

    //When selectorValue === 'Range' a '-' gets added because that's when a range is used in the search.
    if(selectorValue === 'Range') {
        validInputs.push('-');

        if(!validInputs.includes(event.key)) {
            event.preventDefault();
        };
    } else {
        if(!validInputs.includes(event.key)) {
            event.preventDefault();
        };
    }
};

const quantityInputBarOnKeyDownEvt = function(event : KeyboardEvent) {
    //Only allow desired inputs in the text field.
    let validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];

    if(!validInputs.includes(event.key)) {
        event.preventDefault();
    };
};

const removeCheckedItemsBtnEvt = function() {
    /* Remove all listings where the checkbox elements in the 'tabContentsMyActiveMarketListingsRows'
     * children are checked and the children are visible. Then if no listings are visible, refresh. */
    const listingContainer : HTMLDivElement = <HTMLDivElement> document.getElementById('tabContentsMyActiveMarketListingsRows');
    const listingRowElements : HTMLCollection = <HTMLCollection> listingContainer.children;
    const querySelectorString = 'div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox:checked';
    const selectAllCheckbox : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSelectAllCheckbox');
    let visibleListings = getListingsPerPage();

    for(let i = 0; i < listingRowElements.length; i++) {
        if(listingRowElements[i].getAttribute('style') !== 'display: none;') {
            if(listingRowElements[i].querySelector(querySelectorString)) {
                const checkboxElem : HTMLInputElement = <HTMLInputElement> listingRowElements[i].querySelector(querySelectorString);
                removeItemListing(getItemId(listingRowElements[i].id), checkboxElem, false);
                visibleListings--;
            };
        } else {
            visibleListings--;
        };
    };

    if(visibleListings <= 0) {
        refreshListings();
    };

    selectAllCheckbox.checked = false;
};

function lockInputs() : void {
    const searchBarButton : HTMLButtonElement = <HTMLButtonElement> document.getElementById('bGoneSearchBarButton');
    searchBarButton.setAttribute('disabled', 'true');

    const searchBar : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSearchBar');
    searchBar.setAttribute('disabled', 'true');

    const priceInputBar : HTMLInputElement = <HTMLInputElement> document.getElementById('bGonePriceInputBar');
    priceInputBar.setAttribute('disabled', 'true');

    const priceInputSelector : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGonePriceInputSelector');
    priceInputSelector.setAttribute('disabled', 'true');

    const quantityInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');
    quantityInput.setAttribute('disabled', 'true');

    const searchModeSelector : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGoneSettingButton');
    searchModeSelector.setAttribute('disabled', 'true');
};

function unlockInputs() {
    const searchBarButton : HTMLButtonElement = <HTMLButtonElement> document.getElementById('bGoneSearchBarButton');
    searchBarButton.disabled = false;

    const searchBar : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSearchBar');
    searchBar.disabled = false;
    searchBar.value = '';

    const priceInputBar : HTMLInputElement = <HTMLInputElement> document.getElementById('bGonePriceInputBar');
    priceInputBar.disabled = false;
    priceInputBar.value = '';

    const priceInputSelector : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGonePriceInputSelector');
    priceInputSelector.disabled = false;

    const quantityInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');
    quantityInput.disabled = false;
    quantityInput.value = '';

    const searchModeSelector : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGoneSettingButton');
    searchModeSelector.disabled = false;
};

function selectAllCheckboxes() : void {
    //Check all checkbox elements in the 'tabContentsMyActiveMarketListingsRows' children.
    const listingContainer : HTMLDivElement = <HTMLDivElement> document.getElementById('tabContentsMyActiveMarketListingsRows');

    const selectAllCheckbox : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSelectAllCheckbox');

    if(!listingContainer || !selectAllCheckbox) return;

    const listingRowElements : HTMLCollection = listingContainer.children;

    const bGoneCheckboxItems : (HTMLInputElement)[] = [];

    const query = 'div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox';

    for (let item of listingRowElements) {
        if(item.querySelector(query)) {
            let inputElem : HTMLInputElement = <HTMLInputElement> item.querySelector(query);
            bGoneCheckboxItems.push(inputElem);
        };
    };

    if(selectAllCheckbox.checked){
        for(let checkbox of bGoneCheckboxItems) {
            checkbox.checked = true;
        };
    } else {
        for(let checkbox of bGoneCheckboxItems) {
            checkbox.checked = false;
        };
    };
};

function showInfoBox() : boolean {
    const loadingIconElem : HTMLImageElement | null = getLoadingIconElem();
    const infoSpanElem : HTMLSpanElement | null = getInfoSpanElem();
    const countingSpanElem : HTMLSpanElement | null = getCountingSpanElem();//Prolly not using this

    if(infoSpanElem == null || loadingIconElem == null || countingSpanElem == null) {
        console.log('showInfoBox could not find one or more required elements.');
        return false;
    };

    const searchMode : string = getSearchModeSelectorValue();

    if(searchMode === 'Remove listings') {
        infoSpanElem.textContent = 'Listings removed: ';
    } else if(searchMode === 'Count listings') {
        infoSpanElem.textContent = 'Listings found: ';
    } else {
        infoSpanElem.textContent = 'Error, invalid bGoneSettingButton value';
        return false;
    };

    loadingIconElem.setAttribute('style', '');

    return true;
};

function startSearch(prevStartValue : number | undefined) : string {
    let nameInput = getNameInputValue();
    let priceInput = getPriceInputValue();

    //Input fields check.
    if(nameInput === '' && priceInput === '') {
        alert("Can't perform search with both item name and price empty.");
        clearInputFields();
        return 'allEmpty';
    } else {
        let isPriceValid : boolean = checkPriceInput();

        if(!isPriceValid) {
            let priceSearchMode = getPriceModeSelectorValue();

            if(priceSearchMode === 'Range') {
                alert('Input price range is not valid.\nFirst write the minimum value, then a dash (-) and then the maximum value.\nExample: 1.05-3');
                return 'invalidRange';
            } else {
                alert('Input price is not valid.\nOnly values over 0 are accepted.\nExample: 100.25');
                return 'invalidPrice';
            };
        };

        let isQuantityValid = checkQuantityInput();

        if(!isQuantityValid) {
            alert('Input quantity is not valid.\nOnly integers between 0 and the quantity of existing listings are valid.\nExample: 1');
            return 'invalidQuantity';
        };
    };

    //Here starts the first iteration of the search.
    if(prevStartValue === undefined) {
        setCountingSpanValue(0);
        setListingsCounter(0);
        showInfoBox();
        lockInputs();
        getMarketListings(0, 100);
        return 'startedSearch';
    };

    //Either continue or finish the search.
    let listingsAmount : number = getListingsAmount();

    if(prevStartValue !== undefined && listingsAmount > (prevStartValue + 100)) {
        getMarketListings(prevStartValue + 100, 100);
        return 'continueSearch';
    } else {
        //console.log("Succesful requests: " + getSuccessfulRequests());
        //console.log("Failed requests: " + getFailedRequests());

        //Finished search. Straight up refresh the page for now.
        //window.location.reload();
        //refreshListings();
        //----------------------TIS IS VERY IMPORTANT ADD FUNC FOR CHECKING IF LISTINGS REMOVALS FINISHED HERE THEN DO STUFF
        //Do something like if RemoveMode trigger interval for waiting - ('member to reset all the used counters)
        
        if(getSearchModeSelectorValue() == 'Count listings') {
            unlockInputs();
            hideLoadingIcon();
            showPopUp('Found ' + getListingsCounter() + ' matches.');
            setCountingSpanValue(getListingsCounter());
            setListingsCounter(0);
        } else {
            restartSearchAfterRequests();
        };
        return 'endSearch';
    };
};

function clearInputFields() : void {
    const nameInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSearchBar');
    const priceInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGonePriceInputBar');
    const quantityInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');

    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';
};

const changeSearchMode = function() {
    const searchButtonElem : HTMLButtonElement = <HTMLButtonElement> document.getElementById('bGoneSearchBarButton');
    const searchModeSelect : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGoneSettingButton');
    const quantityInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');

    if(searchButtonElem && searchModeSelect && quantityInput) {
        if(searchModeSelect.value === 'Count listings') {
            searchButtonElem.textContent = 'Count';
            quantityInput.setAttribute('style', 'display: none');
        } else {
            searchButtonElem.textContent = 'Remove';
            quantityInput.setAttribute('style', '');
        };
    };
};
