import { getActiveListingPagingPage, getListingsPerPage, getSessionIdCookie, getItemId, getRawPrice, ListingDataObject } from './utils';
import { getNameInputValue, getPriceInputValue, getSelectorValue, getQuantityInputValue, getListingsAmount } from './elementGetters';
import { checkName, checkPrice } from './validationFuncs';
import { startSearch } from './elementEvents';

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

export function removeItemListing(listingId : string, checkboxElement : HTMLInputElement | null) {
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
        } else {
            console.log(httpRequest.status)
        };
    };

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

export function parseMarketListingsData(data : string, startVal : number) {
    let listingsDataJSON;
    let listingRowElements : HTMLCollection = new HTMLCollection;
    const listingsData : ListingDataObject[] = [];

    //Fix mess later
    interface dataResult {results_html : string};
    let jsonObj : any;
    let dataResultObj : any;
    //Fix mess later

    if(data !== 'null' && data.length > 0) {
        jsonObj = JSON.parse(data);
        dataResultObj = jsonObj as dataResult;
    } else {
        //JSON was null
        alert("JSON was null, couldn't search listings");
        return;
    };

    if(dataResultObj.hasOwnProperty('results_html')) {
        const activeListingsTable : HTMLDivElement = document.createElement('div');
        activeListingsTable.innerHTML = dataResultObj['results_html'];

        const querySelectorString = 'div > div#tabContentsMyActiveMarketListingsTable > div#tabContentsMyActiveMarketListingsRows';

        let listingsElement : HTMLDivElement = <HTMLDivElement> activeListingsTable.querySelector(querySelectorString);
        //Tidy up all this
        if(listingsElement) {
            listingRowElements = listingsElement.children;
        };
    } else {
        alert('Field with listing data could not be found');
        return;
    };

    if(!listingRowElements) {
        console.log("listingRowElements = undefined ")
        console.log(listingRowElements);
    };

    //Need: id, name, price
    let listingNameElem : HTMLLinkElement;
    let listingPriceElem : HTMLSpanElement;
    for(let i = 0; i < listingRowElements.length; i++){
        listingNameElem = <HTMLLinkElement> listingRowElements[i].querySelector('a.market_listing_item_name_link');
        listingPriceElem = <HTMLSpanElement> listingRowElements[i].querySelector('span.market_listing_price > span > span:first-child');
        listingsData.push( {
            id: getItemId(listingRowElements[i].id),
            name: listingNameElem.innerHTML,
            price: getRawPrice(listingPriceElem.innerHTML)
        } );
    };
    
    searchMatchingListings(listingsData, startVal);
};

export function searchMatchingListings(listingsData : ListingDataObject[], startVal : number) {
    let name : string = getNameInputValue();
    let priceInput : string = getPriceInputValue();
    let price : number;
    let maxPrice : number = 0;
    let priceSearchMode = getSelectorValue();
    let matchingListingsQuantity : number = getQuantityInputValue();

    if(priceSearchMode === '3') {
        let priceRange : string[] = priceInput.split('-');

        price = Number.parseFloat(getRawPrice(priceRange[0]));
        maxPrice = Number.parseFloat(getRawPrice(priceRange[1]));
    } else {
        price = Number.parseFloat(priceInput);
    };

    for(let i = 0; i < listingsData.length; i++) {

        if(checkName(name, listingsData[i].name) && checkPrice(price, Number.parseFloat(listingsData[i].price), priceSearchMode, maxPrice)) {
            //console.log(listingsData[i].name + '   ' + listingsData[i].price + '   ' + listingsData[i].id);
            removeItemListing(listingsData[i].id, null);

            if(!Number.isNaN(matchingListingsQuantity)) {
                if(matchingListingsQuantity > 1) {
                    matchingListingsQuantity--;
                } else {
                    startSearch(getListingsAmount());
                    return;
                };
            };
        };
    };

    if(!Number.isNaN(matchingListingsQuantity)) {
        let quantityInput : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');
        if(quantityInput) quantityInput.value = matchingListingsQuantity.toString();
         //Update the amount of matching listings to be deleted.
    };
    startSearch(startVal);
};