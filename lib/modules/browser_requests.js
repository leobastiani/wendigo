"use strict";

const RequestFilter = require('../request_filter');

module.exports = class BrowserRequests {
    constructor(browser) {
        this.clear();
        // browser.page.setRequestInterception(true).then(() => {
        browser.page.on('request', interceptedRequest => {
            this._requests._requests.push(interceptedRequest);
            // interceptedRequest.continue();
        });

        // browser.page.on('requestfinished', request=>{
        // })
        // }).catch(() => {});
    }

    get all() {
        return this._requests._requests;
    }

    get filter() {
        return this._requests;
    }

    clear() {
        this._requests = new RequestFilter();
    }
};