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