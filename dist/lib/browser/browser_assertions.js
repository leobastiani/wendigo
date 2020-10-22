"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Assertions
const assertions_core_1 = __importDefault(require("./assertions/assertions_core"));
const browser_not_assertions_1 = __importDefault(require("./assertions/browser_not_assertions"));
const local_storage_assertions_1 = __importDefault(require("../modules/local_storage/local_storage_assertions"));
const cookies_assertion_1 = __importDefault(require("../modules/cookies/cookies_assertion"));
const console_assertion_1 = __importDefault(require("../modules/console/console_assertion"));
const webworkers_assertions_1 = __importDefault(require("../modules/webworkers/webworkers_assertions"));
const request_assertions_filter_1 = __importDefault(require("../modules/requests/request_assertions_filter"));
class BrowserAssertions extends assertions_core_1.default {
    constructor(browser) {
        super(browser);
        this.not = new NotAssertions(this, browser);
        this.localStorage = new local_storage_assertions_1.default(this._browser.localStorage);
    }
    get requests() {
        const requests = this._browser.requests.filter;
        return new request_assertions_filter_1.default((r) => {
            r();
        }, requests);
    }
    console(filterOptions, count, msg) {
        return console_assertion_1.default(this._browser.console, filterOptions, count, msg);
    }
    cookies(name, expected, msg) {
        return cookies_assertion_1.default.assert(this._browser, this._browser.cookies, name, expected, msg);
    }
    webworkers(options, msg) {
        return webworkers_assertions_1.default(this._browser.webworkers, options, msg);
    }
}
exports.default = BrowserAssertions;
class NotAssertions extends browser_not_assertions_1.default {
    cookies(name, expected, msg) {
        return cookies_assertion_1.default.not(this._browser, this._browser.cookies, name, expected, msg);
    }
}
