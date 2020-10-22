"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HeaderHelper {
    constructor(page) {
        this._page = page;
        this.authorizationHeader = "";
    }
    setAuthHeader(value) {
        this.authorizationHeader = value;
        return this.setPageHeaders();
    }
    setExtraHeaders(extraHeaders) {
        this.extraHeaders = extraHeaders || {};
        return this.setPageHeaders();
    }
    setPageHeaders() {
        const headers = Object.assign({}, this.extraHeaders || {});
        if (this.authorizationHeader)
            headers.authorization = this.authorizationHeader;
        return this._page.setExtraHTTPHeaders(headers);
    }
}
exports.default = HeaderHelper;
