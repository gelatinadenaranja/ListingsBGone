





function addExtensionElements() {
    const listingsContentTab : HTMLDivElement = <HTMLDivElement> document.getElementById('tabContentsMyListings');
    
    //Observer to check whenever tabContentsMyListings' child elements change.
    const listingsContentTabObserver : MutationObserver = new MutationObserver(
        function(mutationList) {
            for(const mutation of mutationList) {
                if(mutation.type === 'childList') {
                  addSelectAllCheckBoxContainer();
                  addListingCheckboxes();
                  addListingsElementObserver();
                };
            };
        }
    );

    listingsContentTabObserver.observe(listingsContentTab, {childList: true});

    addSelectAllCheckBoxContainer();
    addListingCheckboxes();
    addListingsElementObserver();

    //Add search elements
    const bGoneSearchBarContainer : HTMLDivElement = document.createElement('div');
    bGoneSearchBarContainer.id = 'bGoneSearchBarContainer';

    const mainContentDiv : HTMLDivElement = <HTMLDivElement> document.getElementById('mainContents');
    mainContentDiv.insertBefore(bGoneSearchBarContainer, document.getElementById('myListings'));

    const searchBarContainer : HTMLDivElement = document.createElement('div');
    searchBarContainer.className = 'bGoneInputContainer';
    bGoneSearchBarContainer.append(searchBarContainer);

    const searchBar : HTMLInputElement = document.createElement('input');
    searchBar.type = 'text';
    searchBar.id = 'bGoneSearchBar';
    searchBar.className = 'bGoneInputBar';
    searchBar.placeholder = 'Enter the item you wish to remove';
    searchBarContainer.append(searchBar);

    const searchBarButton : HTMLButtonElement = document.createElement('button');
    searchBarButton.id = 'bGoneSearchBarButton';
    searchBarButton.textContent = 'Remove';
    searchBarButton.addEventListener('click', (e) => {startSearch(undefined)});
    searchBarContainer.append(searchBarButton);

    const priceInputBarContainer : HTMLDivElement = document.createElement('div');
    priceInputBarContainer.className = 'bGoneInputContainer';
    bGoneSearchBarContainer.append(priceInputBarContainer);

    const priceInputSelector : HTMLSelectElement = document.createElement('select');
    priceInputSelector.id = 'bGonePriceInputSelector';

    const priceInputBar : HTMLInputElement = document.createElement('input');
    priceInputBar.type = 'text';
    priceInputBar.id = 'bGonePriceInputBar';
    priceInputBar.className = 'bGoneInputBar';
    priceInputBar.placeholder = 'Enter the price of the items you want to remove';
    priceInputBar.onkeydown = function(event) {
        //Only allow desired inputs in the text field.
        let selectorValue = getSelectorValue();
        let validInputs = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', 'Backspace'];
    
        //When selectorValue === 'Range' a '-' gets added because that's when a range is used in the search.
        if(selectorValue === 'Range') {
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

    const priceInputEqual : HTMLOptionElement = document.createElement('option');
    //priceInputEqual.value = 0;
    priceInputEqual.textContent = 'Equal to';
    priceInputSelector.append(priceInputEqual);

    const priceInputMoreThan : HTMLOptionElement = document.createElement('option');
    //priceInputMoreThan.value = 1;
    priceInputMoreThan.textContent = 'More Than';
    priceInputSelector.append(priceInputMoreThan);

    const priceInputLessThan : HTMLOptionElement = document.createElement('option');
    //priceInputLessThan.value = 2;
    priceInputLessThan.textContent = 'Less Than';
    priceInputSelector.append(priceInputLessThan);

    const priceInputRange : HTMLOptionElement = document.createElement('option');
    //priceInputRange.value = 3;
    priceInputRange.textContent = 'Range';
    priceInputSelector.append(priceInputRange);

    const quantityInputContainer : HTMLDivElement = document.createElement('div');
    quantityInputContainer.className = 'bGoneInputContainer';
    bGoneSearchBarContainer.append(quantityInputContainer);

    const quantityInputBar : HTMLInputElement = document.createElement('input');
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

function addSelectAllCheckBoxContainer() {
    //Add a div to manage the currently visible listings in the 'tabContentsMyActiveMarketListingsRows' element.
    const activeListingsTable : HTMLDivElement = <HTMLDivElement> document.getElementById('tabContentsMyActiveMarketListingsTable');

    const selectAllCheckBoxContainer : HTMLDivElement = document.createElement('div');
    selectAllCheckBoxContainer.id = 'bGoneSelectAllCheckBoxContainer';

    const selectAllContainer : HTMLLabelElement = document.createElement('label');
    selectAllContainer.id = 'bGoneSelectAllContainer';
    selectAllContainer.textContent = 'Select all shown listings';
    selectAllCheckBoxContainer.append(selectAllContainer);

    const selectAllCheckbox : HTMLInputElement = document.createElement('input');
    selectAllCheckbox.type = 'checkbox';
    selectAllCheckbox.id = 'bGoneSelectAllCheckbox';
    selectAllCheckbox.onclick = selectAllCheckboxes;
    selectAllContainer.append(selectAllCheckbox);

    const buttonContainer : HTMLDivElement = document.createElement('div');
    buttonContainer.style.display = 'flex';
    selectAllCheckBoxContainer.append(buttonContainer);

    const refreshListingsButton : HTMLButtonElement = document.createElement('button');
    refreshListingsButton.id = 'bGoneRefreshListingsButton';
    refreshListingsButton.title = 'Refresh listings'
    refreshListingsButton.onclick = refreshListings;
    buttonContainer.append(refreshListingsButton);

    const refreshListingsButtonIcon : HTMLImageElement = document.createElement('img');
    refreshListingsButtonIcon.src = chrome.runtime.getURL('images/refresh_items_button_icon.png');
    refreshListingsButton.append(refreshListingsButtonIcon);

    const removeCheckedItems : HTMLButtonElement = document.createElement('button');
    removeCheckedItems.id = 'bGoneRemoveCheckedItems';
    removeCheckedItems.textContent = 'Remove checked items';
    removeCheckedItems.onclick = function() {
        /* Remove all listings where the checkbox elements in the 'tabContentsMyActiveMarketListingsRows'
         * children are checked and the children are visible. Then if no listings are visible, refresh. */
        const listingContainer : HTMLDivElement = <HTMLDivElement> document.getElementById('tabContentsMyActiveMarketListingsRows');
        const listingRowElements : HTMLCollection = <HTMLCollection> listingContainer.children;
        const querySelectorString = 'div.market_listing_row.market_recent_listing_row > label.bGoneCheckboxContainer > input[type=checkbox].bGoneCheckbox:checked';
        const selectAllCheckbox : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneSelectAllCheckbox');
        let visibleListings = getListingsPerPage();

        for(let i = 0; i < listingRowElements.length; i++) {
            if(listingRowElements[i].getAttribute('style') !== 'display: none;') {
                if(listingRowElements[i].querySelector(querySelectorString)) {
                    const checkboxElem : HTMLInputElement = <HTMLInputElement> listingRowElements[i].querySelector(querySelectorString);
                    removeItemListing(getItemId(listingRowElements[i].id), checkboxElem);
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

    const removeCheckedItemsIcon : HTMLImageElement = document.createElement('img');
    removeCheckedItemsIcon.src = chrome.runtime.getURL('images/remove_items_button_icon.png');
    removeCheckedItems.append(removeCheckedItemsIcon);

    activeListingsTable.insertBefore(selectAllCheckBoxContainer, document.getElementById('tabContentsMyActiveMarketListingsRows'));
};

function addListingCheckboxes() { 
    //Add the checkbox elements to 'tabContentsMyActiveMarketListingsRows' children.
    const listingRow : HTMLDivElement = <HTMLDivElement> document.getElementById('tabContentsMyActiveMarketListingsRows');
    const listingRowElements : HTMLCollection = <HTMLCollection> listingRow.children;

    for(let i = 0; i < listingRowElements.length; i++) {
        const checkbox : HTMLInputElement = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'bGoneCheckbox';
        //document.createTextNode(checkbox);

        const checkboxContainer : HTMLLabelElement = document.createElement('label');
        checkboxContainer.className = 'bGoneCheckboxContainer';
        checkboxContainer.append(checkbox);
        
        listingRowElements[i].insertBefore(checkboxContainer, listingRowElements[i].firstElementChild);
    };
};

function addListingsElementObserver() {
    //Observer to check whenever 'tabContentsMyActiveMarketListingsRows' changes, which is when the user selects another item page.
    const listingsContainer : HTMLDivElement = <HTMLDivElement> document.getElementById('tabContentsMyActiveMarketListingsRows');

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
