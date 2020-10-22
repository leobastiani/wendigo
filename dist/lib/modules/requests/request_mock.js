"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const events_1 = require("events");
const url_1 = require("url");
const request_filter_1 = __importDefault(require("./request_filter"));
const errors_1 = require("../../models/errors");
const utils = __importStar(require("../../utils/utils"));
class RequestMockAssertions {
    constructor(mock) {
        this._mock = mock;
    }
    called(times, msg) {
        if (typeof times === 'number') {
            const timesCalled = this._mock.timesCalled;
            if (times !== timesCalled) {
                if (!msg)
                    msg = `Mock of ${this._mock.url} not called ${times} times.`;
                return Promise.reject(new errors_1.AssertionError("assert.called", msg, timesCalled, times));
            }
        }
        else if (!this._mock.called) {
            if (!msg)
                msg = `Mock of ${this._mock.url} not called.`;
            return Promise.reject(new errors_1.AssertionError("assert.called", msg));
        }
        return Promise.resolve();
    }
    postBody(expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = new request_filter_1.default(Promise.resolve(this._mock.requestsReceived)).postBody(expected);
            const filteredRequests = yield filter.requests;
            if (filteredRequests.length === 0) {
                if (!msg) {
                    msg = `Expected mock to be called with body "${utils.stringify(expected)}".`;
                }
                throw new errors_1.AssertionError("assert.postBody", msg);
            }
        });
    }
}
class RequestMock {
    constructor(url, options) {
        this.requestsReceived = [];
        this.url = this._parseUrl(url);
        this.response = this._processResponse(options);
        this._delay = options.delay || 0;
        this.method = options.method;
        if (options.queryString !== undefined)
            this.queryString = utils.parseQueryString(options.queryString);
        else
            this.queryString = this._parseUrlQueryString(url);
        this.auto = options.auto !== false;
        this.continue = options.continue === true;
        this._events = new events_1.EventEmitter();
        this._redirectTo = options.redirectTo ? new url_1.URL(options.redirectTo) : undefined;
        this.assert = new RequestMockAssertions(this);
    }
    get called() {
        return this.timesCalled > 0;
    }
    get timesCalled() {
        return this.requestsReceived.length;
    }
    get immediate() {
        return this._delay === 0;
    }
    trigger(response) {
        if (this.auto)
            throw new errors_1.FatalError("trigger", `Cannot trigger auto request mock.`);
        this._events.emit("respond", response);
    }
    waitUntilCalled(timeout = 500) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.called)
                yield new Promise((resolve, reject) => {
                    let rejected = false;
                    const tid = setTimeout(() => {
                        rejected = true;
                        reject(new errors_1.TimeoutError("waitUntilCalled", `Wait until mock of "${this.url}" is called`, timeout));
                    }, timeout);
                    this._events.once("on-request", () => {
                        if (!rejected) {
                            clearTimeout(tid);
                            resolve();
                        }
                    });
                });
            yield utils.delay(20); // Give time to the browser to handle the response
        });
    }
    onRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.requestsReceived.push(request);
            if (this.auto && this.immediate) {
                return this._respondRequest(request);
            }
            else if (this.auto) {
                yield utils.delay(this._delay);
                return this._respondRequest(request);
            }
            else {
                this._onTrigger((response) => {
                    return this._respondRequest(request, response);
                });
            }
        });
    }
    _respondRequest(request, optionalResponse) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = this.response;
            if (optionalResponse) {
                response = this._processResponse(optionalResponse);
            }
            if (this.continue) {
                yield request.continue();
            }
            else if (this._redirectTo) {
                const qs = this._getUrlQuerystring(request.url());
                yield request.continue({
                    url: `${this._redirectTo.origin}${this._redirectTo.pathname}${qs}`
                });
            }
            else
                yield request.respond(response);
            this._events.emit("on-request");
        });
    }
    _onTrigger(cb) {
        this._events.once("respond", cb);
    }
    _getUrlQuerystring(rawUrl) {
        const url = new url_1.URL(rawUrl);
        const qs = url.searchParams.toString();
        if (qs)
            return `?${qs}`;
        else
            return "";
    }
    _processResponse(options) {
        const body = utils.stringify(options.body) || undefined;
        return {
            status: options.status,
            headers: options.headers,
            contentType: options.contentType,
            body: body
        };
    }
    _parseUrlQueryString(url) {
        if (url instanceof RegExp)
            return undefined;
        else {
            const parsedUrl = new url_1.URL(url);
            if (parsedUrl.search) {
                return utils.parseQueryString(parsedUrl.search);
            }
            else
                return undefined;
        }
    }
    _parseUrl(url) {
        if (url instanceof RegExp) {
            return url;
        }
        else {
            const parsedUrl = new url_1.URL(url);
            return `${parsedUrl.origin}${parsedUrl.pathname}`;
        }
    }
}
exports.default = RequestMock;
