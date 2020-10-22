"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_page_1 = __importDefault(require("../puppeteer_wrapper/puppeteer_page"));
class WendigoModule {
    constructor(browser) {
        this._browser = browser;
        this._page = new puppeteer_page_1.default(browser.page);
    }
    _beforeOpen(_options) {
        return Promise.resolve();
    }
    _beforeClose() {
        return Promise.resolve();
    }
    _afterOpen(_options) {
        return Promise.resolve();
    }
}
exports.default = WendigoModule;
