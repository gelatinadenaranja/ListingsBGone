window.addEventListener('load', function isListingsElementAvailable() {
    //Check if there are active listings for the extension to work with.
    if(document.getElementById('tabContentsMyActiveMarketListingsRows')) {
        addExtensionElements();
    };
});

function addSelectAllCheckBoxContainer() {
    //Add checkbox over active listings table for selecting all visible listings and a button to remove checked items.
    const activeListingsTable = document.getElementById('tabContentsMyActiveMarketListingsTable');

    let selectAllCheckBoxContainer = document.createElement('div');
    selectAllCheckBoxContainer.id = 'bGoneSelectAllCheckBoxContainer';

    let selectAllContainer = document.createElement('label');
    selectAllContainer.id = 'bGoneSelectAllContainer';
    selectAllContainer.textContent = 'Select all shown listings';
    selectAllCheckBoxContainer.append(selectAllContainer);

    let selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'bGoneSelectAllCheckbox';
    selectAllCheckbox.onclick = function() {
        //Check all checkbox elements in the 'tabContentsMyActiveMarketListingsRows' children.
        const listingRowElements = document.getElementById('tabContentsMyActiveMarketListingsRows').children;
        let bGoneCheckboxItems = [];
        
        for(let i = 0; i < listingRowElements.length; i++) {
            bGoneCheckboxItems[i] = listingRowElements[i].querySelector('div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox');
        };

        if(this.checked){
            for(let i = 0; i < bGoneCheckboxItems.length; i++){
                bGoneCheckboxItems[i].checked = true;
            };
        } else {
            for(let i = 0; i < bGoneCheckboxItems.length; i++){
                bGoneCheckboxItems[i].checked = false;
            };
        };
    };
    selectAllContainer.append(selectAllCheckbox);

    let buttonContainer = document.createElement("div");
    buttonContainer.style.display = "flex";

    selectAllCheckBoxContainer.append(buttonContainer);

    let refreshListingsButton = document.createElement("button");
    refreshListingsButton.id = "bGoneRefreshListingsButton";
    refreshListingsButton.title = "Refresh listings"
    refreshListingsButton.onclick = refreshListings;
    buttonContainer.append(refreshListingsButton);

    let refreshListingsButtonIcon = document.createElement('img');
    refreshListingsButtonIcon.src = chrome.runtime.getURL("images/refresh_items_button_icon.png");
    refreshListingsButton.append(refreshListingsButtonIcon);

    let removeCheckedItems = document.createElement('button');
    removeCheckedItems.id = 'bGoneRemoveCheckedItems';
    removeCheckedItems.textContent = 'Remove checked items';
    removeCheckedItems.onclick = function() {
        /* Remove all listings where the checkbox elements in the 'tabContentsMyActiveMarketListingsRows'
         * children are checked and the children are visible. Then if no listings are visible, refresh. */
        const listingRowElements = document.getElementById('tabContentsMyActiveMarketListingsRows').children;
        const querySelectorString = 'div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox:checked';
        const selectAllCheckbox = document.getElementById("bGoneSelectAllCheckbox");
        let visibleListings = getListingsPerPage();

        for(let i = 0; i < listingRowElements.length; i++) {
            if(listingRowElements[i].style.display !== 'none') {
                if(listingRowElements[i].querySelector(querySelectorString)) {
                    removeItemListing(getItemId(listingRowElements[i].id), listingRowElements[i].querySelector(querySelectorString));
                    visibleListings--;
                };
            } else {
                visibleListings--;
            };
        };

        if(visibleListings <= 0) {
            refreshListings();
        };

        selectAllCheckbox.checked = false;
    };
    buttonContainer.append(removeCheckedItems);

    let removeCheckedItemsIcon = document.createElement('img');
    removeCheckedItemsIcon.src = chrome.runtime.getURL("images/remove_items_button_icon.png");
    removeCheckedItems.append(removeCheckedItemsIcon);

    activeListingsTable.insertBefore(selectAllCheckBoxContainer, document.getElementById('tabContentsMyActiveMarketListingsRows'));
};

function addListingsElementObserver() {
    //Observer to check whenever 'tabContentsMyActiveMarketListingsRows' changes, which is when the user selects another item page.
    const listingsContainer = document.getElementById('tabContentsMyActiveMarketListingsRows');

                const listingsContainerObserver = new MutationObserver(function(mutationList) {
                    //Observer to check whenever 'tabContentsMyActiveMarketListingsRows' changes, which is when the user selects another item page.
                    for(const mutation of mutationList) {
                        if(mutation.type === 'childList' && !wereCheckboxesAdded()) {
                            addListingCheckboxes();
                        };
                    };
                });
            
                listingsContainerObserver.observe(listingsContainer, {childList: true});
};

function addListingCheckboxes() { 
    //Add the checkbox elements to 'tabContentsMyActiveMarketListingsRows' children.
    const listingRowElements = document.getElementById('tabContentsMyActiveMarketListingsRows').children;
    for(let i = 0; i < listingRowElements.length; i++) {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'bGoneCheckbox';
        document.createTextNode(checkbox);

        let checkboxContainer = document.createElement('label');
        checkboxContainer.name = 'containedCheckbox';
        checkboxContainer.className = 'bGoneCheckboxContainer';
        checkboxContainer.append(checkbox);
        
        listingRowElements[i].insertBefore(checkboxContainer, listingRowElements[i].firstElementChild);
    };
};

function wereCheckboxesAdded() {
    //Check if the checkbox elements were added to the 'tabContentsMyActiveMarketListingsRows' children already.
    const listing = document.getElementById('tabContentsMyActiveMarketListingsRows').firstElementChild;

    if(!(listing === null) && (listing.firstElementChild.className === 'bGoneCheckboxContainer') && (listing.firstElementChild.tagName === 'LABEL')) {
        return true;
    } else {
        return false;
    };
};

//Add the extension's elements
function addExtensionElements() {
    const listingsContentTab = document.getElementById('tabContentsMyListings');
    
    const listingsContentTabObserver = new MutationObserver(function(mutationList) {
        //Observer to check whenever 'tabContentsMyListings' changes, which is when items get refreshed.
        for(const mutation of mutationList) {
            if(mutation.type === "childList") {
                addSelectAllCheckBoxContainer();
                addListingCheckboxes();
                addListingsElementObserver();
            };
        };
    });

    listingsContentTabObserver.observe(listingsContentTab, {childList: true});

    addSelectAllCheckBoxContainer();
    addListingCheckboxes();
    addListingsElementObserver();

    //Add search elements
    let bGoneSearchBarContainer = document.createElement('div');
    bGoneSearchBarContainer.id = 'bGoneSearchBarContainer';
    document.getElementById('mainContents').insertBefore(bGoneSearchBarContainer, document.getElementById('myListings'));

    let searchBarContainer = document.createElement('div');
    searchBarContainer.className = 'bGoneInputContainer';
    bGoneSearchBarContainer.append(searchBarContainer);

    let searchBar = document.createElement('input');
    searchBar.type = 'text';
    searchBar.id = 'bGoneSearchBar';
    searchBar.className = 'bGoneInputBar';
    searchBar.placeholder = 'Enter the item you wish to remove';
    searchBarContainer.append(searchBar);

    let searchBarButton = document.createElement('button');
    searchBarButton.id = 'bGoneSearchBarButton';
    searchBarButton.textContent = 'Remove';
    searchBarButton.addEventListener('click', startSearch);
    searchBarContainer.append(searchBarButton);

    let priceInputBarContainer = document.createElement('div');
    priceInputBarContainer.className = 'bGoneInputContainer';
    bGoneSearchBarContainer.append(priceInputBarContainer);

    let priceInputSelector = document.createElement('select');
    priceInputSelector.id = 'bGonePriceInputSelector';
    let priceInputBar = document.createElement('input');
    priceInputBar.type = 'text';
    priceInputBar.id = 'bGonePriceInputBar';
    priceInputBar.className = 'bGoneInputBar';
    priceInputBar.placeholder = 'Enter the price of the items you want to remove';
    priceInputBar.onkeydown = function(event) {
        //Only allow desired inputs in the text field.
        let selectorValue = document.getElementById('bGonePriceInputSelector').value;
        let validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];
    
        //When selectorValue === '3' a '-' gets added because that's when a range is used in the search.
        if(selectorValue === '3') {
            validInputs.push('-');

            if(!validInputs.includes(event.key)) {
                event.preventDefault();
            };
        } else {
            if(!validInputs.includes(event.key)) {
                event.preventDefault();
            };
        }
    };
    priceInputBarContainer.append(priceInputBar);
    priceInputBarContainer.append(priceInputSelector);

    let priceInputEqual = document.createElement('option');
    priceInputEqual.value = 0;
    priceInputEqual.textContent = 'Equal to';
    priceInputSelector.append(priceInputEqual);

    let priceInputMoreThan = document.createElement('option');
    priceInputMoreThan.value = 1;
    priceInputMoreThan.textContent = 'More Than';
    priceInputSelector.append(priceInputMoreThan);

    let priceInputLessThan = document.createElement('option');
    priceInputLessThan.value = 2;
    priceInputLessThan.textContent = 'Less Than';
    priceInputSelector.append(priceInputLessThan);

    let priceInputRange = document.createElement('option');
    priceInputRange.value = 3;
    priceInputRange.textContent = 'Range';
    priceInputSelector.append(priceInputRange);

    let quantityInputContainer = document.createElement('div');
    quantityInputContainer.className = 'bGoneInputContainer';
    bGoneSearchBarContainer.append(quantityInputContainer);

    let quantityInputBar = document.createElement('input');
    quantityInputBar.type = 'text';
    quantityInputBar.id = 'bGoneQuantityInput';
    quantityInputBar.className = 'bGoneInputBar';
    quantityInputBar.style.display = 'block';
    quantityInputBar.placeholder = 'Enter the quantity of matching listings you want to remove';
    quantityInputBar.onkeydown = function(event) {
        //Only allow desired inputs in the text field.
        let validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'];
    
        if(!validInputs.includes(event.key)) {
            event.preventDefault();
        };
    };
    quantityInputContainer.append(quantityInputBar);

    /*TESTING BUTTONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN*/
    /*let tstbutton = document.createElement('button');
    tstbutton.id = 'tstbutton';
    tstbutton.textContent = 'CLICK ME SON!';
    tstbutton.onclick = setActiveListingPagingPage;
    bGoneSearchBarContainer.append(tstbutton);*/
};

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

function getActiveListingPagingPage() {
    let pagingElement = document.getElementById('tabContentsMyActiveMarketListings_links');
    let activePage = pagingElement.querySelector('span.market_paging_pagelink.active').innerHTML;

    return activePage;
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

function refreshListings() {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onload = function() {

        if(httpRequest.status === 200) {
            let requestResult = httpRequest.responseText;
            requestResult = JSON.parse(requestResult);

            if(requestResult.hasOwnProperty('results_html')) {
                let listingElements = document.createElement('div');
                listingElements.innerHTML = requestResult['results_html'];
                listingElements = listingElements.querySelector('div#tabContentsMyActiveMarketListingsRows');

                document.getElementById('tabContentsMyActiveMarketListingsRows').innerHTML = listingElements.innerHTML;
            } else {
                console.log('Failed to load listings: Data in JSON not found.');
                return;
            };
        } else {
            console.log("Something happened and couldn't get the requested listings data.\nRequest status=" + httpRequest.status);
        };
    };

    let queryStartValue = (getActiveListingPagingPage() - 1) * getListingsPerPage();

    console.log('queryval ' + queryStartValue);
    
    httpRequest.open('GET', 'https://steamcommunity.com/market/mylistings/?start=' + queryStartValue + '&count=' + getListingsPerPage(), true);

    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    httpRequest.send();
};

function checkPriceInput() {
    //Validation for 'bGonePriceInputBar' element input.
    let element = document.getElementById('bGonePriceInputBar');

    if(element.value === '') {
        return true;
    };

    let selectorValue = document.getElementById('bGonePriceInputSelector').value;
    let value;

    if(selectorValue !== '3') {
        //In case the range option isn't used.
        value = removeCommas(element.value);
        value = Number.parseFloat(value);

        if(!Number.isNaN(value) && value > 0) {
            element.value = value;
            return true;
        } else {
            element.value = '';
            return false;
        };
    } else {
        //In case the range option is used.
        value = element.value;

        value = value.split('-');
        if(value.length !== 2) { //ADD CHECK FOR ARRAY DATATYPE
            element.value = '';
            return false;
        }

        //Check each array element individually.
        for(let index = 0; index < 2; index++) {
            value[index] = removeCommas(value[index]);
            
            for(let i = 0; i < value[index].length; i++) {
                if(isNaN(value[index].charAt(i)) && value[index].charAt(i) !== '.') {
                    element.value = '';
                    return false;
                };
            };

            value[index] = Number.parseFloat(value[index]);
        };

        //Can't have a range with two equal values.
        if(value[0] == value[1]) {
            return false;
        };

        //Sorting range values acordingly (Min value-Max value).
        if(value[0] > value[1]) {
            let maxValue = value[0];
            value[0] = value[1];
            value[1] = maxValue;
        };

        element.value = value[0] + '-' + value[1];
        return true;
    };
};

function removeCommas(val) {
    for(let i = 0; i < val.length; i++) {
        if(val.charAt(i) === ',') {
            val = val.replace(/\./g, '');
            val = val.replace(/\,/g, '.');
            break;
        };
    };

    return val;
};

function checkQuantityInput() {
    //Validation for 'bGoneQuantityInput' element input.
    let element = document.getElementById('bGoneQuantityInput');

    if(element.value === '') {
        return true;
    };

    let value = Number.parseInt(element.value);

    if(!Number.isNaN(value) && value > 0 && value <= getListingsAmount()) {
        element.value = value;
        return true;
    } else {
        element.value = '';
        return false;
    };
};

function getItemId(listingElementId) {
    //Function input example: 'mylisting_4060547854836020987'
    return listingElementId.substring(10, listingElementId.length);
};

let canMakeAnotherRequest = true;

function startSearch(prevStartValue) {
    let nameInput = document.getElementById('bGoneSearchBar').value;
    let priceInput = document.getElementById('bGonePriceInputBar').value;

    if(nameInput === '' && priceInput === '') {
        alert("Can't perform search with both item name and price empty.");
        document.getElementById('bGoneQuantityInput').value = '';
        return false;
    } else {
        //Input check.
        let isPriceValid = checkPriceInput();

        if(!isPriceValid) {
            let priceSearchMode = document.getElementById('bGonePriceInputSelector').value;

            if(priceSearchMode === '3') {
                alert('Input price range is not valid.\nFirst write the minimum value, then a dash (-) and then the maximum value.\nExample: 1.05-3');
                return false;
            } else {
                alert('Input price is not valid.\nOnly values over 0 are accepted.\nExample: 100.25');
                return false;
            };
        };

        let isQuantityValid = checkQuantityInput();

        if(!isQuantityValid) {
            alert('Input quantity is not valid.\nOnly integers between 0 and the quantity of existing listings are valid.\nExample: 1');
            return false;
        };
    };

    //Here starts the first iteration of the search.
    if(typeof prevStartValue !== 'number' || prevStartValue === null) {
        lockInputs();
        getMarketListings(0, 100);
        return;
    };

    //Either continue or finish the search.
    let listingsAmount = getListingsAmount();

    if(listingsAmount > (prevStartValue + 100)) {
        getMarketListings(prevStartValue + 100, 100);
    } else {
        //Finished search. Straight up refresh the page for now.
        window.location.reload();
        /*refreshListings();
        unlockInputs();*/
    };
};

function getListingsAmount() {
    let listingsAmount = Number.parseInt(document.getElementById('my_market_activelistings_number').innerHTML);

    if(!Number.isNaN(listingsAmount)) {
        return listingsAmount;
    } else {
        return -1;
    };
};

function getListingsPerPage() {
    const quantityOptions = [];
    quantityOptions.push(document.getElementById("my_listing_pagesize_10"));
    quantityOptions.push(document.getElementById("my_listing_pagesize_30"));
    quantityOptions.push(document.getElementById("my_listing_pagesize_100"));

    for(let i = 0; i < quantityOptions.length; i++) {
        if(quantityOptions[i].className === "disabled") {
            return quantityOptions[i].innerHTML;
        };
    };
};

function lockInputs() {
    let searchBarButton = document.getElementById('bGoneSearchBarButton');
    searchBarButton.setAttribute('disabled', true);

    let searchBar = document.getElementById('bGoneSearchBar');
    searchBar.setAttribute('disabled', true);

    let priceInputBar = document.getElementById('bGonePriceInputBar');
    priceInputBar.setAttribute('disabled', true);

    let priceInputSelector = document.getElementById('bGonePriceInputSelector');
    priceInputSelector.setAttribute('disabled', true);

    let quantityInput = document.getElementById('bGoneQuantityInput');
    quantityInput.setAttribute('disabled', true);
};

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

function getMarketListings(start, count) {
    if(start === undefined) {
        start = 0;
    };

    if(count === undefined) {
        count = 10;
    };

    let httpRequest = new XMLHttpRequest();

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

function removeItemListing(listingId, checkboxElement) {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onload = function() {

        if(httpRequest.status === 200) {
            if(checkboxElement !== null) {
                checkboxElement.checked = false;
            };

            let listingElement = document.getElementById('mylisting_' + listingId);
            if(listingElement) {
                listingElement.style.display = 'none';
            };
        
            let listingsNumber = getListingsAmount();
            if(typeof listingsNumber === 'number' && isFinite(listingsNumber)) {
                listingsNumber = listingsNumber - 1;
            
                let  activeListings = document.getElementById('my_market_activelistings_number');
                activeListings.innerHTML = listingsNumber;

                let sellListings = document.getElementById('my_market_selllistings_number');
                sellListings.innerHTML = listingsNumber;

                let resultsCount = document.getElementById("tabContentsMyActiveMarketListings_total");
                resultsCount.innerHTML = listingsNumber;
           };
        };
    };

    httpRequest.open('POST', 'https://steamcommunity.com/market/removelisting/' + listingId, true);

    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    httpRequest.send('sessionid=' + getSessionIdCookie());
};

function getSessionIdCookie() {
    let cookies = document.cookie;
    let cookieFirstChar = cookies.indexOf('sessionid=') + 10;
    let cookieLastChar;

    for(let i = cookieFirstChar; i < cookies.length; i++){
        if(cookies.charAt(i) === ';') {
            cookieLastChar = i;
            break;
        };
    };

    return cookies.substring(cookieFirstChar, cookieLastChar);
};