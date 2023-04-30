import { getCountingSpanElem, getLoadingIconElem } from './elementGetters';

export type ListingDataObject = { id: string; name: string; price: string; };

let listingsCounter : number = 0;

export function getListingsCounter() : number {
    return listingsCounter;
};

export function setListingsCounter(val : number) : void {
    listingsCounter = val;
};

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

export function getRawPrice(price : string) : string {

    let rawPrice : RegExpMatchArray | null = price.match(/[0-9\,\.]/g);
    
    return rawPrice? removeCommas(rawPrice.join('')) : '-1';
};

export function getItemId(listingElementId : string) : string {
    //Function input example: 'mylisting_4060547854836020987'

    if(!listingElementId) {
        console.log('getItemId() got a falsy value for an ID : ' + listingElementId);
        return '';
    };

    return listingElementId.substring(10, listingElementId.length);
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

export function setCountingSpanValue(val : number) : boolean {
    const countingSpanElem : HTMLSpanElement | null = getCountingSpanElem();

    if(countingSpanElem === null) {
        const infoBox : HTMLDivElement = <HTMLDivElement> document.getElementById('bGoneInfoBox');
        if(infoBox === null) {
            console.log('Element bGoneInfoBox not found.');
            return false;
        };

        const infoCountingSpan : HTMLSpanElement = document.createElement('span');
        infoCountingSpan.id = 'bGoneCountingSpan';
        infoCountingSpan.textContent = '0';
        infoBox.append(infoCountingSpan);
        return true;
    };

    countingSpanElem.textContent = val.toString();
    return true;
};

export function hideLoadingIcon() : void {
    const loadingIconElem : HTMLImageElement | null = getLoadingIconElem();

    if(loadingIconElem === null) return;

    loadingIconElem.setAttribute('style', 'display: none;');
};

export function showPopUp(message : string) : void {
    alert(message);
};