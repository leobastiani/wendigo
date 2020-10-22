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
const errors_1 = require("../../models/errors");
const utils_1 = require("../../utils/utils");
class RequestAssertionsFilter extends Promise {
    constructor(executor, requestFilter) {
        super((resolve, reject) => {
            return executor(resolve, reject);
        });
        this._requestFilter = requestFilter;
    }
    url(expected, msg) {
        const urlFilter = this._requestFilter.url(expected);
        if (!msg)
            msg = `Expected request with url "${expected}" to exist.`;
        return this._assertFilter("assert.requests.url", urlFilter, msg);
    }
    method(expected, msg) {
        const methodFilter = this._requestFilter.method(expected);
        if (!msg)
            msg = `Expected request with method "${expected}" to exist.`;
        return this._assertFilter("assert.requests.method", methodFilter, msg);
    }
    status(expected, msg) {
        const statusFilter = this._requestFilter.status(expected);
        if (!msg)
            msg = `Expected request with status "${expected}" to exist.`;
        return this._assertFilter("assert.requests.status", statusFilter, msg);
    }
    responseHeaders(expected, msg) {
        const responseHeadersFilter = this._requestFilter.responseHeaders(expected);
        if (!msg) {
            const keys = Object.keys(expected);
            const expectedText = keys.map((k) => {
                return `${k}: ${expected[k]}`;
            }).join(", ");
            msg = `Expected response with headers "${expectedText}" to exist.`;
        }
        return this._assertFilter("assert.requests.responseHeaders", responseHeadersFilter, msg);
    }
    ok(expected = true, msg) {
        const okFilter = this._requestFilter.ok(expected);
        if (!msg)
            msg = `Expected ${expected ? "" : "not"} ok request to exist.`;
        return this._assertFilter("assert.requests.ok", okFilter, msg);
    }
    postBody(expected, msg) {
        const bodyFilter = this._requestFilter.postBody(expected);
        if (!msg) {
            const expectedString = utils_1.stringify(expected);
            msg = `Expected request with body "${expectedString}" to exist.`;
        }
        return this._assertFilter("assert.requests.postBody", bodyFilter, msg);
    }
    responseBody(expected, msg) {
        const responseBodyFilter = this._requestFilter.responseBody(expected);
        if (!msg) {
            const expectedString = utils_1.stringify(expected);
            msg = `Expected request with response body "${expectedString}" to exist.`;
        }
        return this._assertFilter("assert.requests.responseBody", responseBodyFilter, msg);
    }
    pending(msg) {
        const responseBodyFilter = this._requestFilter.pending();
        if (!msg)
            msg = `Expected pending request to exist.`;
        return this._assertFilter("assert.requests.pending", responseBodyFilter, msg);
    }
    resourceType(expected, msg) {
        const responseBodyFilter = this._requestFilter.resourceType(expected);
        if (!msg)
            msg = `Expected request with resourceType "${expected}" to exist.`;
        return this._assertFilter("assert.requests.resourceType", responseBodyFilter, msg);
    }
    contentType(expected, msg) {
        const responseBodyFilter = this._requestFilter.contentType(expected);
        if (!msg)
            msg = `Expected request with contentType "${expected}" to exist.`;
        return this._assertFilter("assert.requests.contentType", responseBodyFilter, msg);
    }
    exactly(expected, msg) {
        return new RequestAssertionsFilter((resolve, reject) => {
            this.then(() => {
                return this._assertNumber("assert.requests.exactly", expected, msg, resolve, reject);
            }).catch(() => {
                // Empty Catch
            });
            this.catch((err) => {
                if (err instanceof errors_1.AssertionError) {
                    return this._assertNumber("assert.requests.exactly", expected, msg, resolve, reject);
                }
                else
                    return reject(err);
            });
        }, this._requestFilter);
    }
    _assertFilter(fnName, filter, msg) {
        return new RequestAssertionsFilter((resolve, reject) => {
            return this.then(() => __awaiter(this, void 0, void 0, function* () {
                const reqs = yield filter.requests;
                if (reqs.length > 0)
                    resolve();
                else {
                    const err = new errors_1.AssertionError(fnName, msg);
                    reject(err);
                }
            })).catch((err) => {
                reject(err);
            });
        }, filter);
    }
    _assertNumber(fnName, expected, msg, resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            const reqs = yield this._requestFilter.requests;
            const requestsNumber = reqs.length;
            if (!msg)
                msg = `Expected exactly ${expected} requests, ${requestsNumber} found.`;
            if (requestsNumber === expected)
                return resolve();
            else {
                const err = new errors_1.AssertionError(fnName, msg);
                return reject(err);
            }
        });
    }
}
exports.default = RequestAssertionsFilter;
