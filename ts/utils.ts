export function getActiveListingPagingPage() : string {
    let pagingElement : HTMLSpanElement = <HTMLSpanElement> document.getElementById('tabContentsMyActiveMarketListings_links');
    let activePage = pagingElement.querySelector('span.market_paging_pagelink.active');

    if(!activePage || typeof activePage == 'undefined') {
        return '-1';
    };

    return activePage.innerHTML;
};

export function getListingsPerPage() : number {
    let listingsPerPageStr : string = '';
    let returnVal : number = 0;
    const quantityOption10 : HTMLLinkElement = <HTMLLinkElement> document.getElementById('my_listing_pagesize_10');
    const quantityOption30 : HTMLLinkElement = <HTMLLinkElement> document.getElementById('my_listing_pagesize_30');
    const quantityOption100 : HTMLLinkElement = <HTMLLinkElement> document.getElementById('my_listing_pagesize_100');
    const quantityOptions = [];
    quantityOptions.push(quantityOption10);
    quantityOptions.push(quantityOption30);
    quantityOptions.push(quantityOption100);

    for(let i = 0; i < quantityOptions.length; i++) {
        if(quantityOptions[i].className === 'disabled') {
            listingsPerPageStr = quantityOptions[i].innerHTML;
        };
    };

    if(listingsPerPageStr) {
        returnVal = Number.parseInt(listingsPerPageStr);
    };

    return returnVal;
};

export function getItemId(listingElementId : string) : string {
    //Function input example: 'mylisting_4060547854836020987'

    if(!listingElementId) {
        console.log('getItemId() got a falsy value for an ID : ' + listingElementId);
        return '';
    };

    return listingElementId.substring(10, listingElementId.length);
};

export function getNameInputValue() : string {
    const inputElem : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSearchBar');

    if(!inputElem) {
        return '';
    };

    return inputElem.value;
};

export function getPriceInputValue() : string {
    const inputElem : HTMLInputElement = <HTMLInputElement> document.getElementById('bGonePriceInputBar');

    if(!inputElem) {
        return '-1';
    };

    return inputElem.value;
};

export function getSelectorValue() : string {
    const selectorElem : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGonePriceInputSelector');

    if(!selectorElem) {
        return '-1';
    };

    return selectorElem.value;
};

export function clearInputFields() : void {
    const nameInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSearchBar');
    const priceInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGonePriceInputBar');
    const quantityInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');

    nameInput.value = '';
    priceInput.value = '';
    quantityInput.value = '';
};

export function removeCommas(val : string) : string {
    for(let i = 0; i < val.length; i++) {
        if(val.charAt(i) === ',') {
            val = val.replace(/\./g, '');
            val = val.replace(/\,/g, '.');
            break;
        };
    };

    return val;
};

export function getListingsAmount() : number {
    const listingCountElem : HTMLSpanElement = <HTMLSpanElement> document.getElementById('my_market_activelistings_number');
    let listingsAmount : number = Number.parseInt(listingCountElem.innerHTML);

    if(Number.isNaN(listingsAmount)) return -1;

    return listingsAmount;
};

export function getSessionIdCookie() : string {
    let cookies : string = document.cookie;
    let cookieFirstChar : number = cookies.indexOf('sessionid=') + 10;
    let cookieLastChar : number = cookieFirstChar;

    for(let i = cookieFirstChar; i < cookies.length; i++){
        if(cookies.charAt(i) === ';') {
            cookieLastChar = i;
            break;
        };
    };

    return cookies.substring(cookieFirstChar, cookieLastChar);
};