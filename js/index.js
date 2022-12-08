"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const elements_1 = require("./elements");
window.addEventListener('load', function isListingsElementAvailable() {
    //Check if there are active listings for the extension to work with.
    if (document.getElementById('tabContentsMyActiveMarketListingsRows'))
        (0, elements_1.addExtensionElements)();
});
