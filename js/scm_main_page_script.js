//Check if there are active listings
window.addEventListener("load", function isListingsElementAvailable() {
    if(document.getElementById("tabContentsMyActiveMarketListingsRows")) {
        addExtensionElements();
    };
});

function addListingCheckboxes() { //Add checkboxes for active listings
    const listingRowElements = document.getElementById("tabContentsMyActiveMarketListingsRows").children;
    for(let i = 0; i < listingRowElements.length; i++) {
        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "bGoneCheckbox";
        document.createTextNode(checkbox);

        let checkboxContainer = document.createElement("label");
        checkboxContainer.name = "containedCheckbox";
        checkboxContainer.className = "bGoneCheckboxContainer";
        checkboxContainer.append(checkbox);
        
        listingRowElements[i].insertBefore(checkboxContainer, listingRowElements[i].firstElementChild);
    };
};

function wereCheckboxesAdded() {
    const listing = document.getElementById("tabContentsMyActiveMarketListingsRows").firstElementChild;

    if(!(listing === null) && (listing.firstElementChild.className === "bGoneCheckboxContainer") && (listing.firstElementChild.tagName === "LABEL")) {
        return true;
    } else {
        return false;
    };
};

//Add the extension's elements
function addExtensionElements() {
    addListingCheckboxes();

    const listingsContainer = document.getElementById("tabContentsMyActiveMarketListingsRows");

    const observerCallback = function(mutationList, listingsContainerObserver) {
        for(const mutation of mutationList) {
            if(mutation.type === "childList" && !wereCheckboxesAdded()) {
                addListingCheckboxes();
            };
        };
    };
    const listingsContainerObserver = new MutationObserver(observerCallback);

    listingsContainerObserver.observe(listingsContainer, {childList: true});

    //Add checkbox over active listings table. Used for selecting all visible listings
    const activeListingsTable = document.getElementById("tabContentsMyActiveMarketListingsTable");

    let selectAllCheckBoxContainer = document.createElement("div");
    selectAllCheckBoxContainer.id = "bGoneSelectAllCheckBoxContainer";

    let selectAllContainer = document.createElement("label");
    selectAllContainer.id = "bGoneSelectAllContainer";
    selectAllContainer.textContent = "Select all shown listings";
    selectAllCheckBoxContainer.append(selectAllContainer);

    let selectAllCheckbox = document.createElement("input");
    selectAllCheckbox.type = "checkbox";
    selectAllCheckbox.id = "bGoneSelectAllCheckbox";
    selectAllCheckbox.onclick = function() {
        const listingRowElements = document.getElementById("tabContentsMyActiveMarketListingsRows").children;
        let bGoneCheckboxItems = [];
        
        for(let i = 0; i < listingRowElements.length; i++) {
            bGoneCheckboxItems[i] = listingRowElements[i].querySelector("div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox");
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

    let removeCheckedItems = document.createElement("button");
    removeCheckedItems.id = "bGoneRemoveCheckedItems";
    removeCheckedItems.textContent = "Remove checked items";
    removeCheckedItems.onclick = function() {
        const listingRowElements = document.getElementById("tabContentsMyActiveMarketListingsRows").children;
        const querySelectorString = "div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox:checked";

        for(let i = 0; i < listingRowElements.length; i++) {
            if(listingRowElements[i].querySelector(querySelectorString)) {
                removeItemListing(getItemId(listingRowElements[i].id), listingRowElements[i].querySelector(querySelectorString));
            };
        };
    };
    selectAllCheckBoxContainer.append(removeCheckedItems);

    let removeCheckedItemsIcon = document.createElement("img");
    removeCheckedItemsIcon.src = 'chrome-extension://pagdlobfoanbkfbddkkeohbahhjadekp/images/remove_items_button_icon.png';
    removeCheckedItems.append(removeCheckedItemsIcon);

    activeListingsTable.insertBefore(selectAllCheckBoxContainer, document.getElementById("tabContentsMyActiveMarketListingsRows"));

    //Add search bar
    let bGoneSearchBarContainer = document.createElement("div");
    bGoneSearchBarContainer.id = "bGoneSearchBarContainer";
    document.getElementById("mainContents").insertBefore(bGoneSearchBarContainer, document.getElementById("myListings"));

    let searchBarContainer = document.createElement("div");
    searchBarContainer.className = "bGoneInputContainer";
    bGoneSearchBarContainer.append(searchBarContainer);

    let searchBar = document.createElement("input");
    searchBar.type = "text";
    searchBar.id = "bGoneSearchBar";
    searchBar.className = "bGoneInputField";
    searchBar.placeholder = "Enter the item you wish to remove";
    searchBarContainer.append(searchBar);

    let searchBarButton = document.createElement("button");
    searchBarButton.id = "bGoneSearchBarButton";
    searchBarButton.textContent = "Remove";
    searchBarButton.onclick = getMarketListings;
    searchBarContainer.append(searchBarButton);

    let priceInputBarContainer = document.createElement("div");
    priceInputBarContainer.className = "bGoneInputContainer";
    bGoneSearchBarContainer.append(priceInputBarContainer);

    let priceInputBar = document.createElement("input");
    priceInputBar.type = "number";
    priceInputBar.id = "bGonePriceInputBar";
    priceInputBar.className = "bGoneInputField";
    priceInputBar.placeholder = "Enter the price of the items you want to remove";
    priceInputBarContainer.append(priceInputBar);

    let priceInputSelector = document.createElement("select");
    priceInputSelector.id = "priceInputSelector";
    priceInputBarContainer.append(priceInputSelector);

    let priceInputEqual = document.createElement("option");
    priceInputEqual.value = 0;
    priceInputEqual.textContent = "Equal to";
    priceInputSelector.append(priceInputEqual);

    let priceInputMoreThan = document.createElement("option");
    priceInputMoreThan.value = 1;
    priceInputMoreThan.textContent = "More Than";
    priceInputSelector.append(priceInputMoreThan);

    let priceInputLessThan = document.createElement("option");
    priceInputLessThan.value = 2;
    priceInputLessThan.textContent = "Less Than";
    priceInputSelector.append(priceInputLessThan);

    let priceInputRange = document.createElement("option");
    priceInputRange.value = 3;
    priceInputRange.textContent = "Range";
    priceInputSelector.append(priceInputRange);

    let quantityInputContainer = document.createElement("div");
    quantityInputContainer.className = "bGoneInputContainer";
    bGoneSearchBarContainer.append(quantityInputContainer);


    let quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.id = "bGoneQuantityInput";
    quantityInput.className = "bGoneInputField";
    quantityInput.style.display = "block";
    quantityInput.placeholder = "Enter the quantity of listings you want to remove";
    quantityInputContainer.append(quantityInput);
};

function getItemId(listingElementId) {
    //Function input example: mylisting_4060547854836020987
    return listingElementId.substring(10, listingElementId.length);
};

function removeItemListing(listingId, checkboxElement) {
    let httpRequest = new XMLHttpRequest();

    httpRequest.onload = function() {

        if(httpRequest.status === 200) {
            console.log(checkboxElement !== null);
            console.log(checkboxElement);
            if(checkboxElement !== null) {
                checkboxElement.checked = false;
            };

            let listingElement = document.getElementById("mylisting_" + listingId);
            if(listingElement) {
                listingElement.style.display = "none";
            };
        
            let listingsNumber = Number.parseInt(document.getElementById("my_market_activelistings_number").innerHTML);
            if(typeof listingsNumber === "number" && isFinite(listingsNumber)) {
                listingsNumber = listingsNumber - 1;
            
                let  activeListings = document.getElementById("my_market_activelistings_number");
                activeListings.innerHTML = listingsNumber;

                let sellListings = document.getElementById("my_market_selllistings_number");
                sellListings.innerHTML = listingsNumber;
           };
        };
    };

    httpRequest.open("POST", "https://steamcommunity.com/market/removelisting/" + listingId, true);

    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    httpRequest.send("sessionid=" + getSessionIdCookie());
};

function getSessionIdCookie() {
    let cookies = document.cookie;
    let cookieFirstChar = cookies.indexOf("sessionid=") + 10;
    let cookieLastChar;

    for(let i = cookieFirstChar; i < cookies.length; i++){
        if(cookies.charAt(i) === ";") {
            cookieLastChar = i;
            break;
        };
    };

    return cookies.substring(cookieFirstChar, cookieLastChar);
};

function getMarketListings() {
    let httpRequest = new XMLHttpRequest();
    let listingsNumber = document.getElementById("my_market_activelistings_number").innerHTML;

    httpRequest.onload = function queseyo() {
        parseMarketListingsData(httpRequest.responseText);
    };
    //https://steamcommunity.com/market/mylistings/render/
    //query: '', start: 60, count: 10
    //?query=&start=0&count=
    httpRequest.open("GET", "https://steamcommunity.com/market/mylistings/?start=400", true);

    httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    httpRequest.send();
};

function parseMarketListingsData(data) {
    let listingsDataJSON;
    let listingRowElements;
    const listingsData = [];

    if(data !== "null" && data.length > 0) {
        listingsDataJSON = JSON.parse(data);
    } else {
        //JSON was null
        alert("JSON was null, couldn't search listings");
        return;
    }

    if(listingsDataJSON.hasOwnProperty("results_html")) {
        let activeListingsTable = document.createElement("div");
        activeListingsTable.innerHTML = listingsDataJSON["results_html"];

        let querySelectorString = "div > div#tabContentsMyActiveMarketListingsTable > div#tabContentsMyActiveMarketListingsRows";

        if(activeListingsTable.querySelector(querySelectorString)) {
            listingRowElements = activeListingsTable.querySelector(querySelectorString).children;
        };
    } else {
        alert("Field with listing data could not be found");
        return;
    };

    //id, name, price
    for(let i = 0; i < listingRowElements.length; i++){
        listingsData.push( {
            id: getItemId(listingRowElements[1].id),
            name: listingRowElements[1].querySelector("a.market_listing_item_name_link").innerHTML,
            price: getRawPrice(listingRowElements[1].querySelector("span.market_listing_price > span > span:first-child").innerHTML)
        } );
    };

    return listingsData;
};

function getRawPrice(price) {
    let rawPrice;

    console.log(price.replace(/\D*/, ""));
    return 27;
};