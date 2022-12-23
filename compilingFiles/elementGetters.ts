function getNameInputValue() : string {
    const inputElem : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSearchBar');

    if(!inputElem) {
        console.log('Error with the bGoneSearchBar element');
        return 'Name not Found';
    };

    return inputElem.value;
};

function getPriceInputValue() : string {
    const inputElem : HTMLInputElement = <HTMLInputElement> document.getElementById('bGonePriceInputBar');

    return inputElem ? inputElem.value : '-1';
};

function getSelectorValue() : string {
    const selectorElem : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGonePriceInputSelector');

    return selectorElem ? selectorElem.value : '-1';
};

function getQuantityInputValue() : number {
    const inputElem : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');

    return inputElem ? Number.parseInt(inputElem.value) : -1;
};

function getListingsAmount() : number {
    const listingCountElem : HTMLSpanElement = <HTMLSpanElement> document.getElementById('my_market_activelistings_number');
    let listingsAmount : number = Number.parseInt(listingCountElem.innerHTML);

    if(Number.isNaN(listingsAmount)) return -1;

    return listingsAmount;
};
