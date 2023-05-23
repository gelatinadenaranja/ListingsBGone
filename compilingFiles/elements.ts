



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
    searchBar.placeholder = 'Enter the full name of the item';
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
    priceInputBar.placeholder = 'Enter the price of the listings you want to match';
    priceInputBar.onkeydown = priceInputBarOnKeyDownEvt;
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
    quantityInputBar.onkeydown = quantityInputBarOnKeyDownEvt;
    quantityInputContainer.append(quantityInputBar);

    /*TESTING BUTTONNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN*/
    /*let tstbutton = document.createElement('button');
    tstbutton.id = 'tstbutton';
    tstbutton.setAttribute('style', 'height: 5em; width: 5em;');
    tstbutton.textContent = 'CLICK ME SON!';
    tstbutton.addEventListener("click", () => {console.log("KACHOW")});
    bGoneSearchBarContainer.append(tstbutton);*/

    const menuBoxContainer : HTMLDivElement = document.createElement('div');
    menuBoxContainer.className = 'bGoneMiscContainer';
    bGoneSearchBarContainer.append(menuBoxContainer);

    const infoBox : HTMLDivElement = document.createElement('div');
    infoBox.id = 'bGoneInfoBox';
    menuBoxContainer.append(infoBox);

    const loadingIcon : HTMLImageElement = document.createElement('img');
    loadingIcon.id = 'bGoneLoadingIcon'
    loadingIcon.src = chrome.runtime.getURL('images/loading_icon.gif');
    loadingIcon.setAttribute('style', "display: none;");
    infoBox.append(loadingIcon);

    const infoBoxSpan : HTMLSpanElement = document.createElement('span');
    infoBoxSpan.id = 'bGoneInfoBoxSpan';
    infoBoxSpan.textContent = '';
    infoBox.append(infoBoxSpan);

    const infoCountingSpan : HTMLSpanElement = document.createElement('span');
    infoCountingSpan.id = 'bGoneCountingSpan';
    infoCountingSpan.textContent = '';
    infoBox.append(infoCountingSpan);

    const settingMenu : HTMLSelectElement = document.createElement('select');
    settingMenu.id = 'bGoneSettingButton';
    settingMenu.addEventListener('change', changeSearchMode);
    menuBoxContainer.append(settingMenu);

    /*const settingMenuIcon : HTMLElement = document.createElement('img');
    settingMenuIcon.id = chrome.runtime.getURL('images/combobox_setting_icon.png');
    settingMenu.append(settingMenuIcon);*/

    const settingRemoveListing : HTMLOptionElement = document.createElement('option');
    settingRemoveListing.textContent = 'Remove listings';
    settingMenu.append(settingRemoveListing);

    const settingCountListing : HTMLOptionElement = document.createElement('option');
    settingCountListing.textContent = 'Count listings';
    settingMenu.append(settingCountListing);
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
    removeCheckedItems.onclick = removeCheckedItemsBtnEvt;
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
