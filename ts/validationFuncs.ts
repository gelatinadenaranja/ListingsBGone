import { removeCommas, getListingsAmount } from './utils';

export function checkQuantityInput() : boolean {
    //Validation for 'bGoneQuantityInput' element input.
    const element : HTMLInputElement = <HTMLInputElement> document.getElementById('bGoneQuantityInput');

    if(element.value === '') {
        return true;
    };

    let value = Number.parseInt(element.value);

    if(!Number.isNaN(value) && value > 0 && value <= getListingsAmount()) {
        return true;
    } else {
        element.value = '';
        return false;
    };
};

export function checkPriceInput() : boolean {
    //Validation for 'bGonePriceInputBar' element input.
    const element : HTMLInputElement = <HTMLInputElement> document.getElementById('bGonePriceInputBar');

    if(element.value === '') {
        return true;
    };

    const selectorElem : HTMLSelectElement = <HTMLSelectElement> document.getElementById('bGonePriceInputSelector');
    const selectorValue : string = selectorElem.value;
    let value : number;

    if(selectorValue !== '3') {
        //In case the range option isn't used.
        value = Number.parseFloat(removeCommas(element.value));

        if(!Number.isNaN(value) && value > 0) {
            element.value = value.toString();
            return true;
        } else {
            element.value = '';
            return false;
        };
    } else {
        //In case the range option is used.
        let fullRangeValues : string = element.value;
        let rangeValues : string[];

        rangeValues = fullRangeValues.split('-');
        if(rangeValues.length !== 2) { //ADD CHECK FOR ARRAY DATATYPE
            element.value = '';
            return false;
        };

        //Check each array element individually.
        for(let index = 0; index < 2; index++) {
            rangeValues[index] = removeCommas(rangeValues[index]);
            
            for(let i = 0; i < rangeValues[index].length; i++) {
                if(isNaN(Number.parseInt(rangeValues[index].charAt(i))) && rangeValues[index].charAt(i) !== '.') {
                    element.value = '';
                    return false;
                };
            };
        };

        //Can't have a range with two equal values.
        if(Number.parseFloat(rangeValues[0]) === Number.parseFloat(rangeValues[1])) {
            return false;
        };

        //Sorting range values acordingly (Min value-Max value).
        if(Number.parseFloat(rangeValues[0]) > Number.parseFloat(rangeValues[1])) {
            let maxValue : number = Number.parseFloat(rangeValues[0]);
            rangeValues[0] = rangeValues[1];
            rangeValues[1] = maxValue.toString();
        };

        element.value = rangeValues[0] + '-' + rangeValues[1];
        return true;
    };
};

export function wereCheckboxesAdded() : boolean {
    //Check if the checkbox elements were added to the 'tabContentsMyActiveMarketListingsRows' children already.
    const listingsContainer : HTMLDivElement = <HTMLDivElement> document.getElementById('tabContentsMyActiveMarketListingsRows');

    let listingElement : HTMLDivElement;
    let elementFirstChild : HTMLElement = document.createElement('div');
    
    if(listingsContainer) {
        listingElement = <HTMLDivElement> listingsContainer.firstElementChild;
        elementFirstChild = <HTMLElement> listingElement.firstElementChild;
    };
    

    if((elementFirstChild.className === 'bGoneCheckboxContainer') && (elementFirstChild.tagName === 'LABEL')) {
        return true;
    } else {
        return false;
    };
};