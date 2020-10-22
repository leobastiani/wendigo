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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../../utils/utils");
function processBody(body) {
    if (typeof body === 'object' && !(body instanceof RegExp)) {
        return JSON.stringify(body);
    }
    else
        return body;
}
function filterPromise(p, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const elements = yield p;
        return elements.filter(cb);
    });
}
class RequestFilter {
    constructor(requests = Promise.resolve([])) {
        this._requestList = requests;
    }
    get requests() {
        return this._requestList;
    }
    url(url) {
        const requests = filterPromise(this.requests, el => {
            return utils_1.matchText(el.url(), url);
        });
        return new RequestFilter(requests);
    }
    method(method) {
        const requests = filterPromise(this.requests, el => {
            return utils_1.matchText(el.method(), method);
        });
        return new RequestFilter(requests);
    }
    postBody(body) {
        const parsedBody = processBody(body);
        const requests = filterPromise(this.requests, el => {
            return utils_1.matchText(el.postData(), parsedBody);
        });
        return new RequestFilter(requests);
    }
    responseBody(body) {
        const parsedBody = processBody(body);
        const requests = this.requests.then((req) => __awaiter(this, void 0, void 0, function* () {
            const reqBodyPairs = yield this._getResponsesBody(req);
            const filteredRequests = reqBodyPairs.map(el => {
                if (utils_1.matchText(el[1], parsedBody))
                    return el[0];
                else
                    return false;
            }).filter((r) => {
                return Boolean(r);
            });
            return filteredRequests;
        }));
        return new RequestFilter(requests);
    }
    status(status) {
        const requests = filterPromise(this.requests, el => {
            const response = el.response();
            if (!response)
                return false;
            else
                return response.status() === status;
        });
        return new RequestFilter(requests);
    }
    fromCache(isFromCache = true) {
        const requests = filterPromise(this.requests, el => {
            const response = el.response();
            if (!response)
                return false;
            else
                return response.fromCache() === isFromCache;
        });
        return new RequestFilter(requests);
    }
    responseHeaders(headers) {
        const requests = filterPromise(this.requests, el => {
            return this._responseHasHeader(el, headers);
        });
        return new RequestFilter(requests);
    }
    ok(isOk = true) {
        const requests = filterPromise(this.requests, el => {
            const response = el.response();
            if (!response)
                return false;
            else
                return response.ok() === isOk;
        });
        return new RequestFilter(requests);
    }
    pending() {
        const requests = filterPromise(this.requests, el => {
            const response = el.response();
            return !response;
        });
        return new RequestFilter(requests);
    }
    resourceType(type) {
        const requests = filterPromise(this.requests, el => {
            const resourceType = el.resourceType();
            return resourceType === type;
        });
        return new RequestFilter(requests);
    }
    contentType(type) {
        return this.responseHeaders({
            'content-type': type
        });
    }
    _responseHasHeader(request, headers) {
        const response = request.response();
        if (!response)
            return false;
        const keys = Object.keys(headers);
        for (const key of keys) {
            if (response.headers()[key] === undefined) {
                return false;
            }
            if (!utils_1.matchText(response.headers()[key], headers[key])) {
                return false;
            }
        }
        return true;
    }
    _getResponsesBody(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const responses = yield Promise.all(requests.map((req) => __awaiter(this, void 0, void 0, function* () {
                const response = req.response();
                if (!response)
                    return null;
                else {
                    const text = yield response.text();
                    return [req, text];
                }
            })));
            const filteredResponse = responses.filter((pair) => {
                return pair !== null;
            });
            return filteredResponse;
        });
    }
}
exports.default = RequestFilter;
