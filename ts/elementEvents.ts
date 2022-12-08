import { getNameInputValue, getPriceInputValue, getSelectorValue, getListingsAmount } from './elementGetters';
import { checkPriceInput, checkQuantityInput } from './validationFuncs';
import { getMarketListings } from './httpRequestFuncs';

export function lockInputs() : void {
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
};

export function selectAllCheckboxes() : void {
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

export function startSearch(prevStartValue : number | undefined) : string {
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
            let priceSearchMode = getSelectorValue();

            if(priceSearchMode === '3') {
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
    if(typeof prevStartValue === undefined || prevStartValue === null) {
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
        //Finished search. Straight up refresh the page for now.
        //window.location.reload();
        /*refreshListings();
        unlockInputs();*/
        return 'endSearch';
    };
};

export function clearInputFields() : void {
    const nameInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSearchBar');
    const priceInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGonePriceInputBar');
    const quantityInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');

    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';
};