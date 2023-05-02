import { getActiveListingPagingPage, getListingsPerPage, getSessionIdCookie, getListingsCounter, setListingsCounter, setCountingSpanValue } from './utils';
import { getListingsAmount } from './elementGetters';
import { parseMarketListingsData } from './dataFuncs'

export function refreshListings() {
    const httpRequest : XMLHttpRequest = new XMLHttpRequest();

    httpRequest.onload = function() {

        if(httpRequest.status === 200) {
            //Fix mess later
            interface dataResult {results_html : string};
            let requestResult : string = httpRequest.responseText;
            const jsonObj : any = JSON.parse(requestResult);
            const dataResultObj = jsonObj as dataResult;
            //Fix mess later

            if(dataResultObj) {
                let listingElements : HTMLDivElement = document.createElement('div');
                listingElements.innerHTML = dataResultObj['results_html'];

                const listingRows = listingElements.querySelector('div#tabContentsMyActiveMarketListingsRows');

                const siteListingsContainer : HTMLDivElement = <HTMLDivElement> document.getElementById('tabContentsMyActiveMarketListingsRows')

                if(listingRows !== null) {
                    siteListingsContainer.innerHTML = listingRows.innerHTML;
                };
            } else {
                console.log('Failed to load listings: Data in JSON not found.');
                return;
            };
        } else {
            console.log("Something happened and couldn't get the requested listings data.\nRequest status=" + httpRequest.status);
        };
    };

    const queryStartValue : number = (Number.parseInt(getActiveListingPagingPage()) - 1) * getListingsPerPage();
    
    httpRequest.open('GET', 'https://steamcommunity.com/market/mylistings/?start=' + queryStartValue + '&count=' + getListingsPerPage(), true);

    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    httpRequest.send();
};

export function removeItemListing(listingId : string, checkboxElement : HTMLInputElement | null, countRemoval : boolean) {
    let httpRequest : XMLHttpRequest = new XMLHttpRequest();

    httpRequest.onload = function() {

        if(httpRequest.status === 200) {
            if(checkboxElement !== null) {
                checkboxElement.checked = false;
            };

            const listingElement : HTMLDivElement = <HTMLDivElement> document.getElementById('mylisting_' + listingId);

            if(listingElement) {
                listingElement.style.display = 'none';
            };
        
            let listingsNumber : number = getListingsAmount();

            if(!isNaN(listingsNumber) && isFinite(listingsNumber)) {
                listingsNumber = listingsNumber - 1;
            
                let  activeListings : HTMLSpanElement = <HTMLSpanElement> document.getElementById('my_market_activelistings_number');
                activeListings.innerHTML = listingsNumber.toString();

                let sellListings : HTMLSpanElement = <HTMLSpanElement> document.getElementById('my_market_selllistings_number');
                sellListings.innerHTML = listingsNumber.toString();

                let resultsCount : HTMLSpanElement = <HTMLSpanElement> document.getElementById('tabContentsMyActiveMarketListings_total');
                resultsCount.innerHTML = listingsNumber.toString();
           };

           const countVal : number = getListingsCounter();

           if(countRemoval) {
            if(Number.isNaN(countVal)) {
                setCountingSpanValue(0);
            } else {
                setListingsCounter(countVal + 1);
                setCountingSpanValue(countVal + 1);
            };
           };
        } else {
            console.log("Listing couldn't be removed.Error: " + httpRequest.status)
        };
    };

    //Leave on false for consistency's sake NOT!
    httpRequest.open('POST', 'https://steamcommunity.com/market/removelisting/' + listingId, true);

    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    httpRequest.send('sessionid=' + getSessionIdCookie());
    
};

export function getMarketListings(start : number, count : number) {
    if(start === undefined) start = 0;

    if(count === undefined) count = 10;

    let httpRequest : XMLHttpRequest = new XMLHttpRequest();

    httpRequest.onload = function() {
        if(httpRequest.status === 200) {
            parseMarketListingsData(httpRequest.responseText, start);
        } else {
            console.log("Something happened and couldn't get the requested listings data.\nRequest status=" + httpRequest.status);
        };
    };

    //Use: https://steamcommunity.com/market/mylistings/?query=&start=0&count=
    httpRequest.open('GET', 'https://steamcommunity.com/market/mylistings/?start=' + start + '&count=' + count, true);

    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    httpRequest.send();
};