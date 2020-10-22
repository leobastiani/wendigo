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
class PuppeteerPage {
    constructor(page) {
        this.page = page;
    }
    get keyboard() {
        return this.page.keyboard;
    }
    get mouse() {
        return this.page.mouse;
    }
    get touchscreen() {
        return this.page.touchscreen;
    }
    goto(url) {
        return this.page.goto(url);
    }
    browser() {
        return this.page.browser();
    }
    frames() {
        return this.page.frames();
    }
    close() {
        return this.page.close();
    }
    isClosed() {
        return this.page.isClosed();
    }
    setViewport(config = {}) {
        const finalConfig = Object.assign({}, this.page.viewport(), config);
        return this.page.setViewport(finalConfig);
    }
    on(eventName, cb) {
        this.page.on(eventName, cb);
    }
    off(eventName, cb) {
        this.page.off(eventName, cb);
    }
    evaluateHandle(cb, ...args) {
        return this.page.evaluateHandle(cb, ...args);
    }
    addScriptTag(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.addScriptTag(options);
        });
    }
    setUserAgent(userAgent) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.setUserAgent(userAgent);
        });
    }
    setBypassCSP(value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.setBypassCSP(value);
        });
    }
    content() {
        return this.page.content();
    }
    screenshot(args) {
        return this.page.screenshot(args);
    }
    select(cssPath, ...values) {
        return this.page.select(cssPath, ...values);
    }
    title() {
        return this.page.title();
    }
    goBack() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goBack();
        });
    }
    goForward() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.goForward();
        });
    }
    reload() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.reload();
        });
    }
    waitForNavigation(options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitForNavigation(options);
        });
    }
    waitFor(selector, options, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.page.waitFor(selector, options, ...args);
        });
    }
    $(selector) {
        return this.page.$(selector);
    }
    $x(selector) {
        return this.page.$x(selector);
    }
    $$(selector) {
        return this.page.$$(selector);
    }
    cookies(...urls) {
        return this.page.cookies(...urls);
    }
    setCookie(...cookies) {
        return this.page.setCookie(...cookies);
    }
    deleteCookie(...cookies) {
        return this.page.deleteCookie(...cookies);
    }
    workers() {
        return this.page.workers();
    }
    setRequestInterception(b) {
        return this.page.setRequestInterception(b);
    }
    pdf(options) {
        return this.page.pdf(options);
    }
    setCache(value) {
        return this.page.setCacheEnabled(value);
    }
    setExtraHTTPHeaders(headers) {
        return this.page.setExtraHTTPHeaders(headers);
    }
    setContent(html) {
        return this.page.setContent(html);
    }
    emulateTimezone(tz) {
        return this.page.emulateTimezone(tz); // TODO: remove any when types update
    }
    setGeolocation(geolocation) {
        return this.page.setGeolocation(geolocation);
    }
    emulateMediaType(mediaType) {
        return this.page.emulateMediaType(mediaType);
    }
    emulateMediaFeatures(mediaFeatures) {
        return this.page.emulateMediaFeatures(mediaFeatures);
    }
}
exports.default = PuppeteerPage;
