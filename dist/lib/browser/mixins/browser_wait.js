"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
const lodash_isregexp_1 = __importDefault(require("lodash.isregexp"));
const browser_navigation_1 = __importDefault(require("./browser_navigation"));
const dom_element_1 = __importDefault(require("../../models/dom_element"));
const errors_1 = require("../../models/errors");
const utils_1 = require("../../utils/utils");
const fail_if_not_loaded_1 = __importDefault(require("../../decorators/fail_if_not_loaded"));
const override_error_1 = __importDefault(require("../../decorators/override_error"));
const puppeteer_types_1 = require("../../puppeteer_wrapper/puppeteer_types");
class BrowserWait extends browser_navigation_1.default {
    wait(ms = 250) {
        return utils_1.delay(ms);
    }
    waitFor(selector, timeout, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            args = args.map((e) => {
                if (e instanceof dom_element_1.default)
                    return e.element;
                else
                    return e;
            });
            try {
                yield this._page.waitFor(selector, {
                    timeout: timeout,
                    visible: true
                }, ...args);
            }
            catch (error) {
                let errMsg;
                if (typeof selector === 'function')
                    errMsg = `Waiting for function to return true`;
                else
                    errMsg = `Waiting for element "${selector}"`;
                throw this._overrideWaitError(error, {
                    timeoutMessage: errMsg,
                    selector: `${selector}`,
                    timeout
                });
            }
        });
    }
    waitUntilNotVisible(selector, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            try {
                yield this.waitFor((q) => {
                    const element = WendigoUtils.queryElement(q);
                    return !WendigoUtils.isVisible(element);
                }, timeout, selector);
            }
            catch (err) {
                throw this._overrideWaitError(err, {
                    timeoutMessage: `Waiting for element "${selector}" to not be visible`,
                    selector: `${selector}`,
                    timeout
                });
            }
        });
    }
    waitForUrl(url, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            if (!url)
                return Promise.reject(new errors_1.WendigoError("waitForUrl", `Invalid parameter url.`));
            let parsedUrl = url;
            if (lodash_isregexp_1.default(url)) {
                parsedUrl = {
                    source: url.source,
                    flags: url.flags
                };
            }
            try {
                yield this.waitFor((expectedUrl) => {
                    const currentUrl = window.location.href;
                    if (currentUrl === "about:blank")
                        return false;
                    if (typeof expectedUrl !== 'string') {
                        const regex = new RegExp(expectedUrl.source, expectedUrl.flags);
                        return regex.test(currentUrl);
                    }
                    else {
                        return currentUrl === expectedUrl;
                    }
                }, timeout, parsedUrl);
            }
            catch (err) {
                throw this._overrideWaitError(err, {
                    timeoutMessage: `Waiting for url "${url}"`,
                    timeout
                });
            }
        });
    }
    waitForNavigation(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            const t1 = new Date().getTime();
            try {
                yield this._page.waitForNavigation({
                    timeout: timeout
                });
                const t2 = new Date().getTime();
                const timeDiff = t2 - t1;
                let timeout2 = timeout - timeDiff;
                if (timeout2 < 10)
                    timeout2 = 10; // just in case
                yield this.waitFor(() => {
                    const w = window;
                    return Boolean(w.WendigoUtils);
                }, timeout2);
            }
            catch (err) {
                throw this._overrideWaitError(err, {
                    timeoutMessage: "",
                    timeout
                });
            }
        });
    }
    clickAndWaitForNavigation(selector, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            const result = yield Promise.all([
                this.waitForNavigation(timeout),
                this.click(selector)
            ]);
            return result[1];
        });
    }
    waitForText(text, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            try {
                const xPath = utils_1.createFindTextXPath(text);
                yield this.waitFor((xp) => {
                    return Boolean(WendigoUtils.xPathQuery(xp).length > 0);
                }, timeout, xPath);
            }
            catch (err) {
                throw this._overrideWaitError(err, {
                    timeoutMessage: `Waiting for text "${text}"`,
                    timeout
                });
            }
        });
    }
    waitAndClick(selector, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            try {
                yield this.waitFor(selector, timeout);
                return yield this.click(selector);
            }
            catch (err) {
                throw this._overrideWaitError(err, {
                    timeoutMessage: "",
                    timeout
                });
            }
        });
    }
    waitAndType(selector, text, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitFor(selector, timeout);
            return yield this.type(selector, text);
        });
    }
    waitAndCheck(selector, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.waitFor(selector, timeout);
            return yield this.check(selector);
        });
    }
    waitUntilEnabled(selector, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            timeout = this._getTimeout(timeout);
            try {
                yield this.waitFor((q) => {
                    const element = WendigoUtils.queryElement(q);
                    if (!element)
                        return false;
                    const value = element.getAttribute("disabled");
                    return value === null;
                }, timeout, selector);
            }
            catch (err) {
                throw this._overrideWaitError(err, {
                    timeoutMessage: `Waiting for element "${selector}" to be enabled`,
                    timeout
                });
            }
        });
    }
    _getTimeout(timeout) {
        if (utils_1.isNumber(timeout))
            return timeout;
        else
            return this._settings.defaultTimeout;
    }
    // TODO: this need to be completely reworked to make a sensible approach to error handling
    _overrideWaitError(error, options) {
        if (error instanceof puppeteer_types_1.PuppeteerErrors.TimeoutError || error instanceof errors_1.TimeoutError) {
            return new errors_1.TimeoutError("", options.timeoutMessage, options.timeout);
        }
        if (error instanceof Error && error.message.match(/DOMException\:/) || error instanceof errors_1.QueryError) {
            return new errors_1.QueryError("", `Invalid selector "${options.selector || ""}".`);
        }
        else
            return error;
    }
}
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "waitFor", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "waitUntilNotVisible", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "waitForUrl", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "waitForNavigation", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "clickAndWaitForNavigation", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "waitForText", null);
__decorate([
    fail_if_not_loaded_1.default,
    override_error_1.default(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "waitAndClick", null);
__decorate([
    override_error_1.default(),
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "waitAndType", null);
__decorate([
    override_error_1.default(),
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "waitAndCheck", null);
__decorate([
    override_error_1.default(),
    fail_if_not_loaded_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], BrowserWait.prototype, "waitUntilEnabled", null);
exports.default = BrowserWait;
