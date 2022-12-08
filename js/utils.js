"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSessionIdCookie = exports.removeCommas = exports.getItemId = exports.getRawPrice = exports.getListingsPerPage = exports.getActiveListingPagingPage = void 0;
function getActiveListingPagingPage() {
    let pagingElement = document.getElementById('tabContentsMyActiveMarketListings_links');
    let activePage = pagingElement.querySelector('span.market_paging_pagelink.active');
    if (!activePage || typeof activePage == 'undefined') {
        return '-1';
    }
    ;
    return activePage.innerHTML;
}
exports.getActiveListingPagingPage = getActiveListingPagingPage;
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
exports.getListingsPerPage = getListingsPerPage;
;
function getRawPrice(price) {
    let rawPrice = price.match(/[0-9\,\.]/g);
    return rawPrice ? removeCommas(rawPrice.join('')) : '-1';
}
exports.getRawPrice = getRawPrice;
;
function getItemId(listingElementId) {
    //Function input example: 'mylisting_4060547854836020987'
    if (!listingElementId) {
        console.log('getItemId() got a falsy value for an ID : ' + listingElementId);
        return '';
    }
    ;
    return listingElementId.substring(10, listingElementId.length);
}
exports.getItemId = getItemId;
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
exports.removeCommas = removeCommas;
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
exports.getSessionIdCookie = getSessionIdCookie;
;
