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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const utils_1 = require("../../utils/utils");
const assert_utils_1 = require("../../utils/assert_utils");
const elementsAssertionUtils = __importStar(require("./assert_elements"));
const errors_1 = require("../../models/errors");
const override_error_1 = __importDefault(require("../../decorators/override_error"));
class AssertionsCore {
    constructor(browser) {
        this._browser = browser;
    }
    exists(selector, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msg)
                msg = `Expected element "${selector}" to exists`;
            let element;
            element = yield this._browser.query(selector);
            if (!element)
                throw new errors_1.AssertionError("assert.exists", msg);
        });
    }
    visible(selector, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let visible;
            try {
                visible = yield this._browser.evaluate((q) => {
                    const elements = WendigoUtils.queryAll(q);
                    if (elements.length === 0)
                        throw new errors_1.WendigoError("assert.visible", "Element not Found");
                    for (const e of elements) {
                        if (WendigoUtils.isVisible(e))
                            return true;
                    }
                    return false;
                }, selector);
            }
            catch (err) {
                throw new errors_1.AssertionError("assert.visible", `Selector "${selector}" doesn't match any elements.`);
            }
            if (!visible) {
                if (!msg)
                    msg = `Expected element "${selector}" to be visible.`;
                throw new errors_1.AssertionError("assert.visible", msg);
            }
        });
    }
    tag(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expected) {
                return Promise.reject(new errors_1.WendigoError("assert.tag", `Missing expected tag for assertion.`));
            }
            const tagsFound = yield this._browser.evaluate((q) => {
                const elements = WendigoUtils.queryAll(q);
                const results = [];
                for (const e of elements) {
                    results.push(e.tagName.toLowerCase());
                }
                return results;
            }, selector);
            for (const tag of tagsFound) {
                if (tag === expected)
                    return Promise.resolve();
            }
            if (!msg) {
                msg = `No element with tag "${expected}" found.`;
            }
            throw new errors_1.AssertionError("assert.tag", msg);
        });
    }
    text(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((!expected && expected !== "") || (Array.isArray(expected) && expected.length === 0)) {
                throw new errors_1.WendigoError("assert.text", `Missing expected text for assertion.`);
            }
            const processedExpected = utils_1.arrayfy(expected);
            const texts = yield this._browser.text(selector);
            for (const expectedText of processedExpected) {
                if (!utils_1.matchTextList(texts, expectedText)) {
                    if (!msg) {
                        const foundText = texts.length === 0 ? "no text" : `"${texts.join(" ")}"`;
                        msg = `Expected element "${selector}" to have text "${expectedText}", ${foundText} found.`;
                    }
                    throw new errors_1.AssertionError("assert.text", msg);
                }
            }
        });
    }
    textContains(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((!expected && expected !== "") || (Array.isArray(expected) && expected.length === 0)) {
                throw new errors_1.WendigoError("assert.textContains", `Missing expected text for assertion.`);
            }
            const processedExpected = utils_1.arrayfy(expected);
            const texts = yield this._browser.text(selector);
            for (const expectedText of processedExpected) {
                if (!utils_1.matchTextContainingList(texts, expectedText)) {
                    if (!msg) {
                        const foundText = texts.length === 0 ? "no text" : `"${texts.join(" ")}"`;
                        msg = `Expected element "${selector}" to contain text "${expectedText}", ${foundText} found.`;
                    }
                    throw new errors_1.AssertionError("assert.textContains", msg);
                }
            }
        });
    }
    title(expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const title = yield this._browser.title();
            const foundTitle = title ? `"${title}"` : "no title";
            if (!utils_1.matchText(title, expected)) {
                if (!msg)
                    msg = `Expected page title to be "${expected}", ${foundTitle} found.`;
                throw new errors_1.AssertionError("assert.title", msg);
            }
        });
    }
    class(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let classes;
            try {
                classes = yield this._browser.class(selector);
            }
            catch (err) {
                return Promise.reject(new errors_1.QueryError("assert.class", `Selector "${selector}" doesn't match any elements.`));
            }
            if (!classes.includes(expected)) {
                if (!msg) {
                    const foundClasses = classes.length === 0 ? "no classes" : `"${classes.join(" ")}"`;
                    msg = `Expected element "${selector}" to contain class "${expected}", ${foundClasses} found.`;
                }
                throw new errors_1.AssertionError("assert.class", msg);
            }
        });
    }
    url(expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let url;
            try {
                url = yield this._browser.url();
            }
            catch (err) {
                throw new errors_1.FatalError("assert.url", `Can't obtain page url.${err.extraMessage || err.message}`);
            }
            if (!utils_1.matchText(url, expected)) {
                if (!msg)
                    msg = `Expected url to be "${utils_1.stringify(expected)}", "${url}" found`;
                throw new errors_1.AssertionError("assert.url", msg, url, expected);
            }
        });
    }
    value(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this._browser.value(selector);
            if (value !== expected) {
                if (!msg) {
                    if (value === null)
                        msg = `Expected element "${selector}" to have value "${expected}", no value found`;
                    else
                        msg = `Expected element "${selector}" to have value "${expected}", "${value}" found`;
                }
                throw new errors_1.AssertionError("assert.value", msg, value, expected);
            }
        });
    }
    element(selector, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.elements(selector, 1, msg);
        });
    }
    elements(selector, count, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const assertCountData = elementsAssertionUtils.parseCountInput(count);
            const countCase = elementsAssertionUtils.getCountCase(assertCountData);
            if (!countCase) {
                throw new errors_1.WendigoError("assert.elements", `parameter count (${count}) is not valid.`);
            }
            const elements = yield this._browser.queryAll(selector);
            const elementsCount = elements.length;
            return elementsAssertionUtils.makeAssertion(selector, assertCountData, countCase, elementsCount, msg);
        });
    }
    attribute(selector, attribute, expectedValue, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const customMessage = Boolean(msg);
            if (!customMessage) {
                msg = `Expected element "${selector}" to have attribute "${attribute}"`;
                if (expectedValue)
                    msg = `${msg} with value "${expectedValue}"`;
                if (expectedValue === null)
                    msg = `Expected element "${selector}" not to have attribute "${attribute}"`;
            }
            const attributes = yield this._browser.evaluate((q, attrName) => {
                const elements = WendigoUtils.queryAll(q);
                return Array.from(elements).map((el) => {
                    return el.getAttribute(attrName);
                });
            }, selector, attribute);
            if (attributes.length === 0) {
                if (!customMessage)
                    msg = `${msg}, no element found.`;
                throw new errors_1.AssertionError("assert.attribute", msg);
            }
            const filteredAttributes = attributes.filter(a => a !== null);
            if (expectedValue === null) {
                if (filteredAttributes.length === 0)
                    return Promise.resolve();
            }
            else {
                for (const attr of filteredAttributes) {
                    if (expectedValue === undefined || utils_1.matchText(attr, expectedValue)) {
                        return Promise.resolve();
                    }
                }
            }
            if (!customMessage) {
                const foundElements = new Set(attributes.filter((a) => {
                    return a !== null;
                }));
                if (foundElements.size === 0 || expectedValue === null)
                    msg = `${msg}.`;
                else {
                    const foundArr = Array.from(foundElements);
                    msg = `${msg}, ["${foundArr.join('", "')}"] found.`;
                }
            }
            throw new errors_1.AssertionError("assert.attribute", msg);
        });
    }
    style(selector, style, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let value;
            try {
                value = yield this._browser.evaluate((sel, sty) => {
                    const element = WendigoUtils.queryElement(sel);
                    if (!element)
                        return Promise.reject();
                    const styles = getComputedStyle(element);
                    return styles.getPropertyValue(sty);
                }, selector, style);
            }
            catch (err) {
                throw new errors_1.QueryError("assert.style", `Element "${selector}" not found.`);
            }
            if (value !== expected) {
                if (!msg) {
                    msg = `Expected element "${selector}" to have style "${style}" with value "${expected}"`;
                    if (value)
                        msg = `${msg}, "${value}" found.`;
                    else
                        msg = `${msg}, style not found.`;
                }
                throw new errors_1.AssertionError("assert.style", msg);
            }
        });
    }
    href(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.attribute(selector, "href", expected, msg);
        });
    }
    innerHtml(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expected && expected !== "")
                return Promise.reject(new errors_1.WendigoError("assert.innerHtml", "Missing expected html for assertion."));
            const found = yield this._browser.innerHtml(selector);
            if (found.length === 0) {
                const error = new errors_1.QueryError("assert.innerHtml", `Element "${selector}" not found.`);
                return Promise.reject(error);
            }
            for (const html of found) {
                if (utils_1.matchText(html, expected))
                    return Promise.resolve();
            }
            if (!msg) {
                msg = `Expected element "${selector}" to have inner html "${expected}", "${found.join(" ")}" found.`;
            }
            throw new errors_1.AssertionError("assert.innerHtml", msg, found, expected);
        });
    }
    elementHtml(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!expected && expected !== "")
                return Promise.reject(new errors_1.WendigoError("assert.elementHtml", "Missing expected html for assertion."));
            const found = yield this._browser.elementHtml(selector);
            if (found.length === 0) {
                const error = new errors_1.QueryError("assert.elementHtml", `Element "${selector}" not found.`);
                return Promise.reject(error);
            }
            for (const html of found) {
                if (utils_1.matchText(html, expected))
                    return Promise.resolve();
            }
            if (!msg) {
                msg = `Expected element "${selector}" to have html "${expected}".`;
            }
            throw new errors_1.AssertionError("assert.elementHtml", msg, found, expected);
        });
    }
    options(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedExpected = utils_1.arrayfy(expected);
            const options = yield this._browser.options(selector);
            const same = assert_utils_1.sameMembers(parsedExpected, options);
            if (!same) {
                if (!msg) {
                    const expectedText = parsedExpected.join(", ");
                    const optionsText = options.join(", ");
                    msg = `Expected element "${selector}" to have options "${expectedText}", "${optionsText}" found.`;
                }
                throw new errors_1.AssertionError("assert.options", msg, options, expected);
            }
        });
    }
    selectedOptions(selector, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedExpected = utils_1.arrayfy(expected);
            const selectedOptions = yield this._browser.selectedOptions(selector);
            const same = assert_utils_1.sameMembers(parsedExpected, selectedOptions);
            if (!same) {
                if (!msg) {
                    const expectedText = parsedExpected.join(", ");
                    const optionsText = selectedOptions.join(", ");
                    msg = `Expected element "${selector}" to have options "${expectedText}" selected, "${optionsText}" found.`;
                }
                throw new errors_1.AssertionError("assert.selectedOptions", msg, selectedOptions, expected);
            }
        });
    }
    global(key, expected, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = yield this._browser.evaluate((k) => {
                return window[k];
            }, key);
            if (expected === undefined) {
                if (value === undefined) {
                    if (!msg) {
                        msg = `Expected "${key}" to be defined as global variable.`;
                    }
                    throw new errors_1.AssertionError("assert.global", msg);
                }
            }
            else if (value !== expected) {
                if (!msg) {
                    msg = `Expected "${key}" to be defined as global variable with value "${expected}", "${value}" found.`;
                }
                throw new errors_1.AssertionError("assert.global", msg, value, expected);
            }
            return Promise.resolve();
        });
    }
    checked(selector, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let value;
            try {
                value = yield this._browser.checked(selector);
            }
            catch (err) {
                throw new errors_1.QueryError("assert.checked", `Element "${selector}" not found.`);
            }
            if (value !== true) {
                if (!msg)
                    msg = `Expected element "${selector}" to be checked.`;
                throw new errors_1.AssertionError("assert.checked", msg, value, true);
            }
        });
    }
    disabled(selector, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let value;
            try {
                value = yield this._browser.attribute(selector, "disabled");
            }
            catch (err) {
                throw new errors_1.QueryError("assert.disabled", `Element "${selector}" not found.`);
            }
            if (value === null) {
                if (!msg)
                    msg = `Expected element "${selector}" to be disabled.`;
                throw new errors_1.AssertionError("assert.disabled", msg);
            }
        });
    }
    enabled(selector, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let value;
            try {
                value = yield this._browser.attribute(selector, "disabled");
            }
            catch (err) {
                throw new errors_1.QueryError("assert.enabled", `Element "${selector}" not found.`);
            }
            if (value !== null) {
                if (!msg)
                    msg = `Expected element "${selector}" to be enabled.`;
                throw new errors_1.AssertionError("assert.enabled", msg);
            }
        });
    }
    focus(selector, msg) {
        return __awaiter(this, void 0, void 0, function* () {
            let focused;
            try {
                focused = yield this._browser.evaluate((q) => {
                    const elements = WendigoUtils.queryAll(q);
                    if (elements.length === 0)
                        return Promise.reject();
                    for (const el of elements) {
                        if (document.activeElement === el)
                            return true;
                    }
                    return false;
                }, selector);
            }
            catch (err) {
                throw new errors_1.QueryError("assert.focus", `Element "${selector}" not found.`);
            }
            if (!focused) {
                if (!msg)
                    msg = `Expected element "${selector}" to be focused.`;
                throw new errors_1.AssertionError("assert.focus", msg);
            }
        });
    }
    redirect(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msg)
                msg = `Expected current url to be a redirection.`;
            if (!this._browser.initialResponse)
                throw new errors_1.AssertionError("assert.redirect", msg);
            else {
                const chain = this._browser.initialResponse.request().redirectChain();
                if (chain.length === 0) {
                    throw new errors_1.AssertionError("assert.redirect", msg);
                }
            }
        });
    }
}
__decorate([
    override_error_1.default("assert"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AssertionsCore.prototype, "exists", null);
__decorate([
    override_error_1.default("assert"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AssertionsCore.prototype, "element", null);
__decorate([
    override_error_1.default("assert"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AssertionsCore.prototype, "href", null);
exports.default = AssertionsCore;
