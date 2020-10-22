"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("url");
const utils_1 = require("../../utils/utils");
const request_mock_1 = __importDefault(require("./request_mock"));
class RequestMocker {
    constructor() {
        this._mockedRequests = [];
    }
    getAllMocks() {
        return Array.from(this._mockedRequests);
    }
    getMockedResponse(request) {
        const url = new url_1.URL(request.url());
        const method = request.method();
        return this._getMock(`${url.origin}${url.pathname}`, {
            method: method,
            queryString: url.search ? utils_1.parseQueryString(url) : undefined
        });
    }
    mockRequest(url, options = {}) {
        const mockOptions = Object.assign({}, options);
        if (typeof url === 'string')
            this._removeExactMocks(url, mockOptions); // Removes exact duplicates to avoid redundancy
        const mock = new request_mock_1.default(url, mockOptions);
        this._mockedRequests.push(mock);
        return mock;
    }
    removeMock(url, options = {}) {
        this._mockedRequests = this._mockedRequests.filter((m) => {
            return !(this._matchUrl(url, m.url) && this._matchOptions(m, options));
        });
    }
    clear() {
        this._mockedRequests = [];
    }
    _removeExactMocks(url, options) {
        const method = options.method;
        const queryString = options.queryString;
        this._mockedRequests = this._mockedRequests.filter((m) => {
            const same = m.url === url && method === m.method && this._sameQs(queryString, m.queryString);
            return !same;
        });
    }
    _sameQs(q1, q2) {
        if (q1 === q2)
            return true;
        if (!q1 || !q2)
            return false;
        const parsedQ1 = utils_1.parseQueryString(q1);
        const parsedQ2 = utils_1.parseQueryString(q2);
        return utils_1.compareObjects(parsedQ1, parsedQ2);
    }
    _getMock(url, options) {
        let matchedMock = null;
        for (const m of this._mockedRequests) {
            if (this._matchMock(m, url, options) && this._hasHigherPriority(m, matchedMock)) {
                matchedMock = m;
            }
        }
        return matchedMock;
    }
    _matchMock(mock, url, options) {
        return this._matchUrl(url, mock.url) && this._matchOptions(options, mock);
    }
    _matchOptions(options, expected) {
        if (expected.method && options.method !== expected.method)
            return false;
        if (expected.queryString !== undefined && !this._sameQs(options.queryString, expected.queryString))
            return false;
        return true;
    }
    _matchUrl(url, expected) {
        return utils_1.matchText(url, expected);
    }
    // Priority is: Method > URL > QueryString
    _hasHigherPriority(m1, m2) {
        if (!m2)
            return true;
        const existsPriority = this._checkElementPriority(m1, m2);
        if (existsPriority !== null)
            return existsPriority;
        const methodPriority = this._checkElementPriority(m1.method, m2.method);
        if (methodPriority !== null)
            return methodPriority;
        const urlPriority = this._checkElementPriority(!(m1.url instanceof RegExp), !(m2.url instanceof RegExp));
        if (urlPriority !== null)
            return urlPriority;
        return Boolean(this._checkElementPriority(m1.queryString, m2.queryString));
    }
    _checkElementPriority(e1, e2) {
        e1 = Boolean(e1);
        e2 = Boolean(e2);
        if (e1 && !e2)
            return true;
        if (!e1 && e2)
            return false;
        else
            return null;
    }
}
exports.default = RequestMocker;
