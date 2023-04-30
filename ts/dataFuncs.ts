import { getItemId, getRawPrice, ListingDataObject, setListingsCounter, getListingsCounter } from './utils';
import { getNameInputValue, getPriceInputValue, getPriceModeSelectorValue, getQuantityInputValue, getListingsAmount, getSearchModeSelectorValue } from './elementGetters';
import { removeItemListing } from './httpRequestFuncs';
import { checkName, checkPrice } from './validationFuncs';
import { startSearch } from './elementEvents';

export function parseMarketListingsData(data : string, startVal : number) {
    let listingRowElements : HTMLCollection | undefined;
    const listingsData : ListingDataObject[] = [];
    interface dataResult {results_html : string};
    let jsonObj : any;
    let dataResultObj : dataResult;

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

    if(listingRowElements === undefined) {
        console.log("listingRowElements = undefined ")
        console.log(listingRowElements);
        return;
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
    let priceSearchMode = getPriceModeSelectorValue();
    let matchingListingsQuantity : number = getQuantityInputValue();

    if(priceSearchMode === 'Range') {
        let priceRange : string[] = priceInput.split('-');

        price = Number.parseFloat(getRawPrice(priceRange[0]));
        maxPrice = Number.parseFloat(getRawPrice(priceRange[1]));
    } else {
        price = Number.parseFloat(priceInput);
    };

    for(let i = 0; i < listingsData.length; i++) {

        if(checkName(name, listingsData[i].name) && checkPrice(price, Number.parseFloat(listingsData[i].price), priceSearchMode, maxPrice)) {
            //console.log(listingsData[i].name + '   ' + listingsData[i].price + '   ' + listingsData[i].id);

            if(getSearchModeSelectorValue() == 'Remove listings') {
                removeItemListing(listingsData[i].id, null, true);
            } else {
                setListingsCounter(getListingsCounter() + 1);
            };

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