function getListingsPerPage() {
    //Get how many items per page the user has set.
    const quantityOptions = [];
    quantityOptions.push(document.getElementById("my_listing_pagesize_10"));
    quantityOptions.push(document.getElementById("my_listing_pagesize_30"));
    quantityOptions.push(document.getElementById("my_listing_pagesize_100"));

    for(let i = 0; i < quantityOptions.length; i++) {
        if(quantityOptions[i].className === "disabled") {
            return parseInt(quantityOptions[i].innerText, 10);
        };
    };
};

function setActiveListingPagingPage(targetIndex) {
    let pagingElements = [...document.getElementById('tabContentsMyActiveMarketListings_links').children];
    let currentActivePage
    let targetActivePage;

    for(let i = 0; i < pagingElements.length; i++) {
        if(pagingElements[i].classList.contains('active')) currentActivePage = pagingElements[i];
        if(pagingElements[i].textContent === `${targetIndex} `) targetActivePage = pagingElements[i];
    };

    if(targetActivePage) {
        currentActivePage.classList.remove('active');
        targetActivePage.classList.add('active');
        return true;
    } else {
        return false;
    };
};

function getItemId(listingElementId) {
    //Function input example: 'mylisting_4060547854836020987'
    return listingElementId.substring(10, listingElementId.length);
};

let canMakeAnotherRequest = true;

function unlockInputs() {
    let searchBarButton = document.getElementById('bGoneSearchBarButton');
    searchBarButton.disabled = false;

    let searchBar = document.getElementById('bGoneSearchBar');
    searchBar.disabled = false;
    searchBar.value = '';

    let priceInputBar = document.getElementById('bGonePriceInputBar');
    priceInputBar.disabled = false;
    priceInputBar.value = '';

    let priceInputSelector = document.getElementById('bGonePriceInputSelector');
    priceInputSelector.disabled = false;

    let quantityInput = document.getElementById('bGoneQuantityInput');
    quantityInput.disabled = false;
    quantityInput.value = '';
};

function parseMarketListingsData(data, startVal) {
    let listingsDataJSON;
    let listingRowElements;
    const listingsData = [];

    if(data !== 'null' && data.length > 0) {
        listingsDataJSON = JSON.parse(data);
    } else {
        //JSON was null
        alert("JSON was null, couldn't search listings");
        return;
    }

    if(listingsDataJSON.hasOwnProperty('results_html')) {
        let activeListingsTable = document.createElement('div');
        activeListingsTable.innerHTML = listingsDataJSON['results_html'];

        let querySelectorString = 'div > div#tabContentsMyActiveMarketListingsTable > div#tabContentsMyActiveMarketListingsRows';

        if(activeListingsTable.querySelector(querySelectorString)) {
            listingRowElements = activeListingsTable.querySelector(querySelectorString).children;
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
    for(let i = 0; i < listingRowElements.length; i++){
        listingsData.push( {
            id: getItemId(listingRowElements[i].id),
            name: listingRowElements[i].querySelector('a.market_listing_item_name_link').innerHTML,
            price: getRawPrice(listingRowElements[i].querySelector('span.market_listing_price > span > span:first-child').innerHTML)
        } );
    };
    
    searchMatchingListings(listingsData, startVal);
};

function getRawPrice(price) {
    let rawPrice = (price.match(/[0-9\,\.]/g)).join('');

    rawPrice = removeCommas(rawPrice);

    rawPrice = Number.parseFloat(rawPrice);

    return rawPrice;
};

function searchMatchingListings(listingsData, startVal) {
    let name = document.getElementById('bGoneSearchBar').value;
    let price = document.getElementById('bGonePriceInputBar').value;
    let maxPrice;
    let priceSearchMode = document.getElementById('bGonePriceInputSelector').value;
    let matchingListingsQuantity = Number.parseInt(document.getElementById('bGoneQuantityInput').value);

    if(priceSearchMode === '3') {
        let priceRange = price.split('-');

        price = getRawPrice(priceRange[0]);
        maxPrice = getRawPrice(priceRange[1]);
    } else {
        price = Number.parseFloat(price);
    };

    for(let i = 0; i < listingsData.length; i++) {

        if(checkName(name, listingsData[i].name) && checkPrice(price, listingsData[i].price, priceSearchMode, maxPrice)) {
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
        let quantityInput = document.getElementById('bGoneQuantityInput');
        quantityInput.value = matchingListingsQuantity; //Update the amount of matching listings to be deleted.
    };
    startSearch(startVal);
};

function checkName(nameParam, itemName) {
    if(nameParam === '') {
        return true;
    };

    return nameParam == itemName;
};

function checkPrice(priceParam, price, mode, maxPrice) {
    if(Number.isNaN(priceParam) || priceParam === '') {
        return true;
    };

    /*
    0 - Equal to
    1 - More than
    2 - Less than
    3 - Range
    */
    switch (mode) {
        case '0':
            return priceParam == price;
        case '1':
            return priceParam < price;
        case '2':
            return priceParam > price;
        case '3':
            return (priceParam < price) && (price < maxPrice);
        default:
            console.log('Using default price search mode for some reason.');
            return price == priceParam;
    };
};