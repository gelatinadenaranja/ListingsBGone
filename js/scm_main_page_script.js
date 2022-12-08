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