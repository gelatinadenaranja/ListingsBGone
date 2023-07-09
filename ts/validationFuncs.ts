import { removeCommas } from './utils';
import { getListingsAmount, getPriceModeSelectorValue } from './elementGetters';

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

    const selectorValue : string = getPriceModeSelectorValue();
    let value : number;

    if(selectorValue !== 'Range') {
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
        if(rangeValues.length !== 2 || rangeValues === null) {
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

export function checkName(nameParam : string, itemName : string) : boolean {
    if(nameParam === '') return true;

    return nameParam == itemName;
};

export function checkPrice(priceParam : number, price : number, mode : string, maxPrice : number) : boolean {
    if(Number.isNaN(priceParam)) return true;

    /*
    0 - Equal to
    1 - More than
    2 - Less than
    3 - Range
    */
   //priceParam === #bGonePriceInputBar's value
    switch (mode) {
        case 'Equal to':
            return priceParam === price;
        case 'More Than':
            return priceParam < price;
        case 'Less Than':
            return priceParam > price;
        case 'Range':
            return (priceParam <= price) && (price <= maxPrice);
        default:
            console.log('Using default price search mode for some reason.');
            return price === priceParam;
    };
};