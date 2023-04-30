export function getNameInputValue() : string {
    const inputElem : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSearchBar');

    if(!inputElem) {
        console.log('Error with the bGoneSearchBar element');
        return 'Name not Found';
    };

    return inputElem.value;
};

export function getPriceInputValue() : string {
    const inputElem : HTMLInputElement = <HTMLInputElement> document.getElementById('bGonePriceInputBar');

    return inputElem ? inputElem.value : '-1';
};

export function getPriceModeSelectorValue() : string {
    const selectorElem : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGonePriceInputSelector');

    return selectorElem ? selectorElem.value : '-1';
};

export function getQuantityInputValue() : number {
    const inputElem : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');

    return inputElem ? Number.parseInt(inputElem.value) : -1;
};

export function getListingsAmount() : number {
    const listingCountElem : HTMLSpanElement = <HTMLSpanElement> document.getElementById('my_market_activelistings_number');
    let listingsAmount : number = Number.parseInt(listingCountElem.innerHTML);

    if(Number.isNaN(listingsAmount)) return -1;

    return listingsAmount;
};

export function getSearchModeSelectorValue() : string {
    const selectorElem : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGoneSettingButton');
    
    return selectorElem ? selectorElem.value : '-1';
};

export function getLoadingIconElem() : HTMLImageElement | null {
    const loadingIconElem : HTMLImageElement | null = <HTMLImageElement> document.getElementById('bGoneLoadingIcon');

    return loadingIconElem ? loadingIconElem : null;
};

export function getInfoSpanElem() : HTMLSpanElement | null {
    const infoSpanElem : HTMLSpanElement | null = <HTMLSpanElement> document.getElementById('bGoneInfoBoxSpan');

    return infoSpanElem ? infoSpanElem : null;
};

export function getCountingSpanElem() : HTMLSpanElement | null {
    const countingSpan : HTMLSpanElement | null = <HTMLSpanElement> document.getElementById('bGoneCountingSpan');

    return countingSpan ? countingSpan : null;
};

export function getCountingSpanValue() : number {
    const countingSpan : HTMLSpanElement = <HTMLSpanElement> document.getElementById('bGoneCountingSpan');
    let count : number = Number.parseInt(countingSpan.innerHTML);

    if(Number.isNaN(count)) return 0;

    return count;
};