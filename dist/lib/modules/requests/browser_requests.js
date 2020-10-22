"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const wendigo_module_1 = __importDefault(require("../wendigo_module"));
const request_filter_1 = __importDefault(require("./request_filter"));
const request_mocker_1 = __importDefault(require("./request_mocker"));
const errors_1 = require("../../models/errors");
const utils_1 = require("../../utils/utils");
class BrowserRequests extends wendigo_module_1.default {
    constructor(browser, settings) {
        super(browser);
        this._requestMocker = new request_mocker_1.default();
        this._requests = [];
        this._interceptorReady = false;
        this._settings = settings;
        this.clearRequests();
    }
    get filter() {
        return new request_filter_1.default(Promise.resolve(this._requests));
    }
    all() {
        return this._requests;
    }
    getAllMocks() {
        return this._requestMocker.getAllMocks();
    }
    mock(url, options) {
        return this._requestMocker.mockRequest(url, options);
    }
    removeMock(url, options) {
        this._requestMocker.removeMock(url, options);
    }
    clearRequests() {
        this._requests = [];
    }
    clearMocks() {
        this._requestMocker.clear();
    }
    setHeaders(headers) {
        return this._browser._headerHelper.setExtraHeaders(headers);
    }
    waitForNextRequest(url, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            try {
                yield this._waitForRequestEvent("request", url, timeout);
            }
            catch (err) {
                throw new errors_1.TimeoutError("waitForNextRequest", `Waiting for request "${url}"`, timeout);
            }
        });
    }
    waitForNextResponse(url, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            try {
                yield this._waitForRequestEvent("response", url, timeout);
            }
            catch (err) {
                throw new errors_1.TimeoutError("waitForNextResponse", `Waiting for response "${url}"`, timeout);
            }
        });
    }
    waitForRequest(url, timeout = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            const waitForPromise = this.waitForNextRequest(url, timeout);
            const alreadyRequestsPromise = this.filter.url(url).requests.then((requests) => {
                if (requests.length > 0)
                    return Promise.resolve();
                else
                    return Promise.reject();
            });
            try {
                yield utils_1.promiseOr([alreadyRequestsPromise, waitForPromise]);
            }
            catch (err) {
                throw new errors_1.TimeoutError("waitForRequest", `Waiting for request "${url}"`, timeout);
            }
        });
    }
    waitForResponse(url, timeout = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            const waitForPromise = this.waitForNextResponse(url, timeout);
            const alreadyResponsePromise = this.filter.url(url).requests.then((requests) => {
                const responded = requests.filter((request) => {
                    return Boolean(request.response());
                });
                if (responded.length > 0)
                    return Promise.resolve();
                else
                    return Promise.reject();
            });
            try {
                yield utils_1.promiseOr([alreadyResponsePromise, waitForPromise]);
            }
            catch (err) {
                throw new errors_1.TimeoutError("waitForResponse", `Waiting for response "${url}"`, timeout);
            }
        });
    }
    _beforeOpen(options) {
        return __awaiter(this, void 0, void 0, function* () {
            this.clearRequests();
            if (this._interceptorReady)
                return Promise.resolve();
            yield this._startRequestInterceptor();
            if (this._settings.logRequests)
                yield this._startResponseLogInterceptor();
            if (options.headers)
                yield this.setHeaders(options.headers);
        });
    }
    _beforeClose() {
        this.clearMocks();
        this.clearRequests();
        this._closeRequestInterceptor();
        return Promise.resolve();
    }
    _startRequestInterceptor() {
        return __awaiter(this, void 0, void 0, function* () {
            this._interceptorReady = true;
            yield this._page.setRequestInterception(true);
            this._interceptorCallback = (request) => {
                this._requests.push(request);
                const mock = this._requestMocker.getMockedResponse(request);
                if (mock) {
                    return mock.onRequest(request);
                }
                else {
                    return request.continue();
                }
            };
            this._page.on('request', this._interceptorCallback);
        });
    }
    _startResponseLogInterceptor() {
        return __awaiter(this, void 0, void 0, function* () {
            this._responseInterceptorCallback = (response) => __awaiter(this, void 0, void 0, function* () {
                const request = response.request();
                if (this._settings.logRequests) {
                    console.log(`[${new Date().toISOString()}] ${request.method()} ${request.url()} ${response.status()}`);
                }
            });
            this._page.on('response', this._responseInterceptorCallback);
        });
    }
    _closeRequestInterceptor() {
        if (this._interceptorCallback) {
            this._page.off('request', this._interceptorCallback);
            this._interceptorCallback = undefined;
        }
        if (this._responseInterceptorCallback) {
            this._page.off('response', this._responseInterceptorCallback);
            this._responseInterceptorCallback = undefined;
        }
    }
    _waitForRequestEvent(event, url, timeout) {
        return new Promise((resolve, reject) => {
            const waitForEventCallback = (response) => __awaiter(this, void 0, void 0, function* () {
                const currentUrl = new URL(response.url());
                const match = utils_1.matchText(`${currentUrl.origin}${currentUrl.pathname}`, url);
                if (match) {
                    this._page.off(event, waitForEventCallback);
                    resolve();
                }
            });
            setTimeout(() => {
                this._page.off(event, waitForEventCallback);
                reject();
            }, timeout);
            this._page.on(event, waitForEventCallback);
        });
    }
    _getTimeout(timeout) {
        if (utils_1.isNumber(timeout))
            return timeout;
        else
            return this._settings.defaultTimeout;
    }
}
exports.default = BrowserRequests;
